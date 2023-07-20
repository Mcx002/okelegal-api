import { myConfig } from '../../config'
import jwt, { Algorithm, SignOptions } from 'jsonwebtoken'
import { ClientError } from '../../utils/errors'
import { errors } from '../constants/error.constant'
import { DateTime } from 'luxon'
import { IssueJWT_Payload, JWTPayload, Session, ValidateJWT_Payload } from '../../dto/auth.dto'

export class JwtAdapter {
    private readonly algorithm: Algorithm
    private readonly issuer: string
    private readonly secret: string

    constructor() {
        this.algorithm = 'HS512'
        this.issuer = myConfig.jwtIssuer
        this.secret = myConfig.jwtSecret
    }

    issue(options: IssueJWT_Payload): Session {
        // Destructure arguments
        let { createdAt } = options
        const { subject, subjectType, audience, lifetime, sessionXid, metadata } = options

        // Set default values
        if (!createdAt) {
            createdAt = new Date()
        }

        // Init options
        const jwtOptions: SignOptions = {
            algorithm: this.algorithm,
            issuer: this.issuer,
            subject,
            audience,
            expiresIn: lifetime,
            jwtid: sessionXid,
        }

        // Init payload
        const payload: JWTPayload = {
            ent: subjectType,
            meta: metadata,
        }

        // Calculate expiry
        const exp = DateTime.fromJSDate(createdAt).plus({ second: lifetime }).toSeconds()

        // Generate token
        const token = jwt.sign(payload, this.secret, jwtOptions)

        return {
            token: token,
            expiredAt: exp,
        }
    }

    validate(token: string, options: ValidateJWT_Payload): JWTPayload {
        // Verify jwt
        try {
            const payload = jwt.verify(token, this.secret, {
                audience: options.audience,
                subject: options.subject,
                algorithms: [this.algorithm],
                issuer: this.issuer,
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
                        throw new ClientError('Did not meet expected audience: ' + options.audience).setStatus(403)
                    } else if (errType.includes('jwt subject invalid')) {
                        throw new ClientError('Invalid subject').setStatus(401)
                    } else if (errType === 'jwt malformed') {
                        throw new ClientError('Malformed token').setStatus(401)
                    } else if (errType === 'invalid signature') {
                        throw new ClientError('Invalid signature').setStatus(401)
                    }
                    break
                }
                case 'TokenExpiredError': {
                    throw errors.sessionExpired
                }
            }

            // Else, throw e to internal error
            throw e
        }
    }
}

export const jwtAdapter = new JwtAdapter()
