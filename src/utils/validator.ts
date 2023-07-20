import Validator, { AsyncCheckFunction, SyncCheckFunction, ValidationSchema } from 'fastest-validator'
import { ClientError } from './errors'

export class MValidator {
    static buildSchema<T>(rules: ValidationSchema<T> | ValidationSchema<T>[]): SyncCheckFunction | AsyncCheckFunction {
        const v = new Validator()

        return v.compile<T>(rules)
    }
    static validate(schema: SyncCheckFunction | AsyncCheckFunction, payload: unknown): true {
        const validatePayload = schema(payload)

        if (validatePayload !== true) {
            throw new ClientError('Please Check Your Input', validatePayload)
        }

        return true
    }
}
