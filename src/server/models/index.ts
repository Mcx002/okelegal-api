import { User } from './user.model'
import Provider from '../../provider'
import DbAdapter from '../adapters/db.adapter'
import { ClientAuth } from './client-auth.model'
import { AuthSession } from './auth-session.model'
import { Submission } from './submission.model'
import { Invoice } from './invoice.model'
import { Admin } from './admin.model'
import { AdminAuth } from './admin-auth.model'

export default class ModelProvider {
    public dbContext: DbAdapter
    constructor(provider: Provider) {
        this.dbContext = new DbAdapter(provider)
        const sequelize = this.dbContext.sequelize

        // Initiate Model
        AuthSession.initModel(sequelize)
        User.initModel(sequelize)
        ClientAuth.initModel(sequelize)
        Submission.initModel(sequelize)
        Invoice.initModel(sequelize)
        Admin.initModel(sequelize)
        AdminAuth.initModel(sequelize)

        Admin.hasOne(AdminAuth, { foreignKey: 'adminId', as: 'adminAuth' })
    }
}
