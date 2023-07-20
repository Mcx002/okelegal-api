import { ServerError } from './errors'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.test') })

export const getEnvString = (property: string, defaultValue?: string): string => {
    let result = process.env[property]

    if (result === undefined && defaultValue !== undefined) {
        result = defaultValue
    }

    if (result === undefined) {
        throw new ServerError(`Env ${property} is Undefined`)
    }

    return result
}

export const getEnvNumber = (property: string, defaultValue?: number): number => {
    const result = getEnvString(property, defaultValue?.toString())
    const resultNumber = parseInt(result)

    if (Number.isNaN(resultNumber)) {
        throw new ServerError('Env value is not a number value')
    }

    return resultNumber
}

export const getEnvBoolean = (property: string, defaultValue?: boolean): boolean => {
    const result = getEnvString(property, defaultValue?.toString())
    let resultBool
    switch (result) {
        case '0':
            resultBool = false
            break
        case '1':
            resultBool = true
            break
        case 'false':
            resultBool = false
            break
        case 'true':
            resultBool = true
            break
        default:
            throw new ServerError('Env is not a boolean. Valid boolean types: [0, 1, true, false]')
    }

    return resultBool
}
