import BaseService from '../base/base-service'
import Provider from '../../provider'
import {
    AuthorizeGoogleAuthCodePayload,
    AuthProviderEnum,
    GoogleJsonWebKeyData,
    JWTPayload,
    SessionResult,
    Subject,
    UserSessionResult,
    ValidateSessionOptions,
} from '../../dto/auth.dto'
import { jwtAdapter } from '../adapters/jwt.adapter'
import { ClientType, isSubjectAnonymous, SubjectPrivileges, SubjectType } from '../constants/auth.constant'
import { AuthRepository } from '../repositories/auth.repository'
import { errors } from '../constants/error.constant'
import { ServerError } from '../../utils/errors'
import * as randomstring from 'randomstring'
import bcrypt from 'bcrypt'
import { myConfig } from '../../config'
import jwt, { Algorithm } from 'jsonwebtoken'
import { UserService } from './user.service'
import { AuthSessionAttributes } from '../models/auth-session.model'
import { dateToUnix } from '../../utils/date-formatter'

export class AuthService extends BaseService {
    // repositories
    authRepository!: AuthRepository

    // services
    userService!: UserService

    init(provider: Provider) {
        const { repository, service } = provider

        this.authRepository = repository.authRepository
        this.userService = service.userService
    }

    createClientAuthSession = async (clientId: string, clientSecret: string): Promise<SessionResult> => {
        const row = await this.authRepository.findClientAuthByClientId(clientId)
        if (!row) {
            throw errors.resourceNotFound
        }

        // validate client secret
        const valid = await bcrypt.compare(clientSecret, row.clientSecret)
        if (!valid) {
            this.logger.error(`invalid client secret provided for clientId "${clientId}"`)
            throw errors.unauthorized
        }

        // Determine audience
        let subjectType: SubjectType
        switch (row.clientTypeId) {
            case ClientType.CustomerWebApp:
                subjectType = SubjectType.AnonymousCustomer
                break
            case ClientType.AdminWebCms:
                subjectType = SubjectType.AnonymousAdmin
                break
            default:
                throw new ServerError(
                    `unhandled jwt client audience when authenticating client. clientTypeId = ${row.clientTypeId}`
                )
        }

        const scopes = SubjectPrivileges[subjectType]

        const session = jwtAdapter.issue({
            subject: row.clientId,
            audience: scopes,
            lifetime: myConfig.lifetimeAnonymous,
            sessionXid: randomstring.generate(6),
            subjectType: SubjectType.AnonymousCustomer,
        })

        return { session, scopes }
    }

    validateSession = async (options: ValidateSessionOptions): Promise<Subject> => {
        // Verify jwt
        const { token, privileges, metadata } = options
        const payload = jwtAdapter.validate(token, { audience: privileges })

        // Retrieve subject type
        const subjectType = payload.ent as SubjectType
        if (subjectType == null) {
            this.logger.debug('ent is not found in jwt payload')
            throw errors.unauthorized
        }

        if (isSubjectAnonymous(subjectType)) {
            return new Subject({ subjectType, metadata })
        }

        // Get session xid
        const sessionXid = payload.jti as string
        if (!sessionXid) {
            this.logger.debug('sessionXId not found in jwt payload')
            throw errors.unauthorized
        }

        // Find session by xid
        const session = await this.authRepository.findAuthSessionByXid(sessionXid)
        if (!session) {
            throw errors.unauthorized
        }

        // Validate integrity
        this.verifyTokenIntegrity(payload, session)

        // Get subject reference
        switch (subjectType) {
            case SubjectType.Admin:
            case SubjectType.User:
                return this.userService.getAuthSubject({
                    sessionId: session.id,
                    subjectId: session.subjectId,
                })
            default: {
                this.logger.error(`unknown reference search for subject type "${subjectType}"`)
                throw errors.unauthorized
            }
        }
    }

    verifyTokenIntegrity(payload: JWTPayload, session: AuthSessionAttributes): void {
        if (payload.sub !== session.subjectId) {
            this.logger.warn('token might be forged. invalid subject found', {
                metadata: { expected: session.subjectId, actual: payload.sub, sessionXId: session.xid },
            })
            throw errors.unauthorized
        }

        if (payload.ent !== session.subjectTypeId) {
            this.logger.debug('token might be forged. invalid subjectType found', {
                metadata: { expected: session.subjectTypeId, actual: payload.ent, sessionXId: session.xid },
            })
            throw errors.unauthorized
        }

        const expectedExpiredAt = dateToUnix(session.expiredAt)
        if (payload.exp && payload.exp > expectedExpiredAt) {
            this.logger.debug('token might be forged. actual expiration is longer than stored', {
                metadata: { expected: expectedExpiredAt, actual: payload.exp, sessionXId: session.xid },
            })
            throw errors.unauthorized
        }
    }

    verifyGoogleIdToken = (idToken: string, pem: string, algorithm: Algorithm): JWTPayload => {
        try {
            // verify token
            const payload = jwt.verify(idToken, pem, {
                algorithms: [algorithm],
            })

            if (typeof payload === 'object') {
                return payload
            } else {
                return {
                    str: payload,
                }
            }
        } catch (e) {
            if (!(e instanceof Error)) {
                throw e
            }

            switch (e.name) {
                case 'JsonWebTokenError': {
                    // Get messages
                    const errType = e.message

                    if (errType.includes('jwt audience invalid')) {
                        this.logger.error('Did not meet expected audience')
                    } else if (errType.includes('jwt subject invalid')) {
                        this.logger.error('Invalid subject')
                    } else if (errType === 'jwt malformed') {
                        this.logger.error('Malformed token')
                    } else if (errType === 'invalid signature') {
                        this.logger.error('Invalid signature')
                    }
                    break
                }
                case 'TokenExpiredError': {
                    this.logger.error('Google Id Token is expired')
                }
            }

            this.logger.error('Unexpected verification failed')
            throw errors.googleHttpRequest
        }
    }

    retrieveGoogleTokenKid = (idToken: string): string => {
        const idTokenHeader = idToken.split('.')[0]
        const decodedHeaderToken = atob(idTokenHeader)
        const jwtHeader = JSON.parse(decodedHeaderToken) as jwt.JwtHeader

        // extract key ID
        const kid = jwtHeader.kid
        if (!kid) {
            this.logger.error('Id Token Key ID is undefined')
            throw errors.googleHttpRequest
        }

        return kid
    }

    getJwkByKid = async (kid: string) => {
        const jwks = await this.authRepository.findGoogleJsonWebKey()
        const jwk = jwks.keys.find((val: GoogleJsonWebKeyData) => {
            if (val.kid === kid) {
                return val
            }
        })
        if (!jwk) {
            this.logger.error('Jwk Key ID is not match with token Key ID')
            throw errors.googleHttpRequest
        }

        return jwk
    }

    composeGetGoogleTokenUrl = (code: string) => {
        const grantType = 'authorization_code'

        return (
            myConfig.googleUriToken +
            `?client_id=${myConfig.googleClientId}` +
            `&client_secret=${myConfig.googleClientSecret}` +
            `&code=${encodeURIComponent(code)}` +
            `&grant_type=${grantType}` +
            `&redirect_uri=${myConfig.googleUriRedirect}`
        )
    }

    authorizeGoogleAuthCode = async (payload: AuthorizeGoogleAuthCodePayload): Promise<UserSessionResult> => {
        // retrieve payload
        const { code, device } = payload

        // compose url
        const url = this.composeGetGoogleTokenUrl(code)

        // get token
        const data = await this.authRepository.findGoogleToken(url)

        // find google public keys
        const pems = await this.authRepository.findGooglePrivacyEnhanceMail()

        // retrieve kid
        const kid = this.retrieveGoogleTokenKid(data.id_token)

        // find match Json Web Key
        const jwk = await this.getJwkByKid(kid)

        const verifiedJwtPayload = this.verifyGoogleIdToken(data.id_token, pems[kid], jwk.alg)

        const email: string | undefined = verifiedJwtPayload['email']
        if (!email) {
            throw errors.unauthorized
        }

        return this.userService.createSession(email, AuthProviderEnum.GOOGLE, device, verifiedJwtPayload['name'])
    }

    // -- Service Function Port -- //
}
