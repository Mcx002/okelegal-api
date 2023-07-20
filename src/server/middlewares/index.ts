import Provider from '../../provider'
import { AuthMiddleware } from './auth.middleware'
import BaseMiddleware from '../base/base-middleware'

// -- Service Import Port -- //

export default class MiddlewareProvider {
    provider!: Provider

    // Service Store
    authMiddleware: AuthMiddleware = new AuthMiddleware()
    // -- Service Initiation Port -- //

    init(provider: Provider): void {
        this.provider = { ...provider }
        this.provider.logger = provider.logger.child({ childLabel: 'Middleware' })

        // Initiate Service
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseMiddleware) {
                r.logger = this.provider.logger
                r.init(this.provider)
                this.provider.logger.info(`${k} initiated`)
            }
        })
    }
}
