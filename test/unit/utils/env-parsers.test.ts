import { getEnvBoolean, getEnvNumber, getEnvString } from '../../../src/utils/env-parsers'
import { ServerError } from '../../../src/utils/errors'

describe('Env Parser Utility', () => {
    test('Parse String', () => {
        const appName = getEnvString('APP_NAME')

        expect(appName).toBe('Base Rest API')

        expect(() => {
            getEnvString('APP_NAMA')
        }).toThrow(ServerError)

        const appName2 = getEnvString('APP_NAMA', 'Best APP')

        expect(appName2).toBe('Best APP')
    })
    test('Parse Number', () => {
        const dbPort = getEnvNumber('DB_PORT')

        expect(dbPort).toBe(5433)

        expect(() => {
            getEnvNumber('DB_NAME')
        }).toThrow(ServerError)
    })
    test('Parse Boolean', () => {
        const bool = getEnvBoolean('TEST_BOOL_1')

        expect(bool).toBe(false)

        const bool2 = getEnvBoolean('TEST_BOOL_2')

        expect(bool2).toBe(true)

        const bool3 = getEnvBoolean('TEST_BOOL_3')

        expect(bool3).toBe(true)

        const bool4 = getEnvBoolean('TEST_BOOL_4')

        expect(bool4).toBe(false)

        const boolNa = getEnvBoolean('TEST_BOOL_NA', false)

        expect(boolNa).toBe(false)

        expect(() => {
            getEnvBoolean('TEST_BOOL_5')
        }).toThrow(new ServerError('Env is not a boolean. Valid boolean types: [0, 1, true, false]'))
    })
})
