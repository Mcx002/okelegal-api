import winston from 'winston'
import EnvConfiguration from '../../src/config'
import Provider from '../../src/provider'
import { createLoggerTest } from '../logger'
import { getLogLevel, initProvider } from '../../src/boot'

describe('Booting Test', () => {
    let config: EnvConfiguration
    beforeAll(() => {
        config = new EnvConfiguration()
    })
    test('Logger is Defined', () => {
        // Init logger
        const logger = winston.createLogger({
            format: winston.format.cli(),
            transports: [new winston.transports.Console()],
        })

        // expect logger defined
        expect(logger).toBeDefined()
    })

    test('Env Configuration Can Be Loaded', () => {
        // Expect config is match with certain object
        expect(config).toMatchObject({
            nodeEnv: 'test',
        })
    })

    test('Dependencies Injection Working Well', () => {
        // Init logger
        const logger = createLoggerTest()

        // Prepare provider
        const provider = new Provider(logger)

        // expected config and logger to be defined and undefined for controller
        expect(provider.logger).toBeDefined()
        expect(provider.controller).toBeUndefined()

        // Set up providers
        initProvider(provider)

        // Expected provider has defined controller
        expect(provider.controller).toBeDefined()
    })

    test('Should return logLevel to be equal error', () => {
        const logLevel = getLogLevel('test')

        expect(logLevel).toBe('error')
    })

    test('Should return logLevel to be equal info', () => {
        const logLevel = getLogLevel('development')

        expect(logLevel).toBe('info')
    })
})
