import { createLoggerTest } from './logger'
import Provider from '../src/provider'
import { initProvider } from '../src/boot'
import { Sequelize } from 'sequelize'

export const createProviderTest = (conn: Sequelize): Provider => {
    // Init logger
    const logger = createLoggerTest()

    // Prepare provider
    const provider = new Provider(logger)

    initProvider(provider, conn)

    return provider
}
