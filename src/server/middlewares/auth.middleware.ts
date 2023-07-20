import BaseMiddleware from '../base/base-middleware'
import Provider from '../../provider'
import { errors } from '../constants/error.constant'
import { captureClientIP } from '../../utils/express-utils'
import { RequestWithSubject } from '../../utils/subject'
import { AuthService } from '../services/auth.service'
import { Privilege } from '../constants/auth.constant'

export class AuthMiddleware extends BaseMiddleware {
    authService!: AuthService

    init(provider: Provider): void {
        this.authService = provider.service.authService
    }

    ValidateSession = async (req: RequestWithSubject, privileges: Privilege[]) => {
        const authorization = req.headers.authorization
        if (!authorization) {
            throw errors.unauthorized
        }

        const [type, token] = authorization.split(' ')
        if (type !== 'Bearer') {
            throw errors.unauthorized
        }

        req.__subject = await this.authService.validateSession({
            token,
            metadata: {
                clientIP: captureClientIP(req),
            },
            privileges,
        })
    }
}
