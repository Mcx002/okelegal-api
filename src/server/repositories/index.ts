import Provider from '../../provider'
import BaseRepository from '../base/base-repository'

// Repository Imports
import { UserRepository } from './user.repository'
import { AuthRepository } from './auth.repository'
import { SubmissionRepository } from './submission.repository'
import { InvoiceRepository } from './invoice.repository'
import { Sequelize } from 'sequelize'
// -- Repository Import Port -- //

export default class RepositoryProvider {
    provider!: Provider
    conn!: Sequelize

    // Repository Store
    userRepository = new UserRepository()
    authRepository = new AuthRepository()
    submissionRepository = new SubmissionRepository()
    invoiceRepository = new InvoiceRepository()
    // -- Repository Initiation Port -- //

    init(provider: Provider, conn: Sequelize): void {
        this.provider = { ...provider }
        this.conn = conn
        this.provider.logger = provider.logger.child({ childLabel: 'Repository' })

        // Initiate Repository
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseRepository) {
                r.logger = this.provider.logger
                r.init(this.provider)
                this.provider.logger.debug(`${k} initiated`)
            }
        })
    }
}
