import { User } from './user.model'
import Provider from '../../provider'
import DbAdapter from '../adapters/db.adapter'
import { ClientAuth } from './client-auth.model'
import { AuthSession } from './auth-session.model'
import { Submission } from './submission.model'

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
    }
}
