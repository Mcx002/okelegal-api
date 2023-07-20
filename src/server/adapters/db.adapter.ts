import { myConfig, NodeEnvType } from '../../config'
import { Dialect, Sequelize } from 'sequelize'
import { Logger } from 'winston'
import Provider from '../../provider'
import { ServerError } from '../../utils/errors'

export default class DbAdapter {
    private logger: Logger
    sequelize: Sequelize

    constructor(provider: Provider) {
        this.logger = provider.logger.child({ childLabel: 'DbAdapter' })

        this.sequelize = new Sequelize(myConfig.dbName, myConfig.dbUsername, myConfig.dbPassword, {
            dialect: myConfig.dbDialect as Dialect,
            host: myConfig.dbHost,
            port: myConfig.dbPort,
            logging: myConfig.nodeEnv !== NodeEnvType.Test,
        })
    }

    disconnect = async () => {
        await this.sequelize.close()
    }

    checkConnection = async (): Promise<boolean> => {
        try {
            await this.sequelize.authenticate()
            this.logger.info('Database Connected')
            return true
        } catch (e) {
            throw new ServerError('Unable to connect to the database')
        }
    }
}
