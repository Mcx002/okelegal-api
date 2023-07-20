import Provider from '../../provider'
import BaseService from '../base/base-service'

// Service Imports
import { HealthService } from './health.service'
import { UserService } from './user.service'
import { AuthService } from './auth.service'
import { SubmissionService } from './submission.service'
import { InvoiceService } from './invoice.service'
// -- Service Import Port -- //

export default class ServiceProvider {
    provider!: Provider

    // Service Store
    healthService: HealthService = new HealthService()
    userService: UserService = new UserService()
    authService = new AuthService()
    submissionService = new SubmissionService()
    invoiceService = new InvoiceService()
    // -- Service Initiation Port -- //

    init(provider: Provider): void {
        this.provider = { ...provider }
        this.provider.logger = provider.logger.child({ childLabel: 'Service' })

        // Initiate Service
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseService) {
                r.logger = this.provider.logger
                r.init(this.provider)
                this.provider.logger.info(`${k} initiated`)
            }
        })
    }
}
