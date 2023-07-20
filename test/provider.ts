import { createLoggerTest } from './logger'
import Provider from '../src/provider'
import { initProvider } from '../src/boot'

export const createProviderTest = (): Provider => {
    // Init logger
    const logger = createLoggerTest()

    // Prepare provider
    const provider = new Provider(logger)

    initProvider(provider)

    return provider
}
