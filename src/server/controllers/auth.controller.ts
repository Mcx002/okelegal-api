import BaseController from '../base/base-controller'
import { Get, Module, Post } from '../../decorators/controller.decorator'
import Provider from '../../provider'
import Express from 'express'
import { errors } from '../constants/error.constant'
import { AuthService } from '../services/auth.service'
import { myConfig } from '../../config'
import { ResponsePromise, ResponseRedirect } from '../../dto/common.dto'
import { ValidateSession } from '../../decorators/auth.decorator'
import { Privilege } from '../constants/auth.constant'
import { AuthSessionDevice, SessionResult, UserSessionResult } from '../../dto/auth.dto'
import { MValidator } from '../../utils/validator'
import { getGoogleAuthorizedValidator } from '../validators/auth.validator'
import { captureClientIP } from '../../utils/express-utils'

@Module('/auth')
export class AuthController extends BaseController {
    // services
    authService!: AuthService

    init(provider: Provider) {
        const { service } = provider

        this.authService = service.authService
    }

    @Post('/anonymous')
    async postCreateAnonymousSession(req: Express.Request): ResponsePromise<SessionResult> {
        // retrieve token
        const token = req.headers.authorization
        if (!token) {
            throw errors.unauthorized
        }

        // decode token
        const encodedToken = token.split(' ')[1]
        const decodedToken = atob(encodedToken)

        // Create anonymous session
        const [clientId, clientSecret] = decodedToken.split(':')
        const data = await this.authService.createClientAuthSession(clientId, clientSecret)

        return { data }
    }

    @Get('/google')
    getGoogleLogin(_: Express.Request): ResponseRedirect {
        const scopes = ['openid', 'email', 'profile']
        const responseType = 'code'
        const accessType = 'offline'

        // Encode URL Value
        const encodedScopes = encodeURIComponent(scopes.join(' '))

        const url =
            myConfig.googleUriAuth +
            `?client_id=${myConfig.googleClientId}` +
            `&redirect_uri=${myConfig.googleUriRedirect}` +
            `&response_type=${responseType}` +
            `&scope=${encodedScopes}` +
            `&access_type=${accessType}`

        return {
            redirect: url,
        }
    }

    @Get('/google/authorized')
    @ValidateSession([Privilege.AnonymousUser])
    async getGoogleAuthorized(req: Express.Request): ResponsePromise<UserSessionResult> {
        const code = (req.query.code ?? '').toString()
        const payload = req.body as AuthSessionDevice
        payload.clientIP = captureClientIP(req)

        MValidator.validate(getGoogleAuthorizedValidator, payload)

        const data = await this.authService.authorizeGoogleAuthCode({ code, device: payload })

        return {
            data,
        }
    }

    // -- Controller Function Port -- //
}
