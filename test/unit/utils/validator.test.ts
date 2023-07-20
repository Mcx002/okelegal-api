import Validator from 'fastest-validator'
import { expect } from '@jest/globals'
import { MValidator } from '../../../src/utils/validator'
import { ClientError } from '../../../src/utils/errors'

describe('Utils Validator', () => {
    test('Normal Usage', () => {
        const v = new Validator()

        const schema = {
            id: { type: 'number', positive: true, integer: true },
            name: { type: 'string', min: 3, max: 255 },
            status: 'boolean',
        }

        const check = v.compile(schema)

        expect(check({ id: 5, name: 'John', status: true })).toBe(true)
        expect(check({ id: 2, name: 'Adam' })).toHaveLength(1)
    })
    test('Utils Validator', () => {
        // prepare schema
        const schema = MValidator.buildSchema({
            id: { type: 'number', positive: true, integer: true },
            name: { type: 'string', min: 3, max: 255 },
            status: 'boolean',
        })

        // prepare payload
        const payload = {
            id: 1,
            name: 3,
            status: false,
        }

        expect(() => MValidator.validate(schema, payload)).toThrow(ClientError)

        // prepare payload
        const payload2 = {
            id: 1,
            name: 'muchlish',
            status: false,
        }

        const cb = MValidator.validate(schema, payload2)

        expect(cb).toBe(true)
    })
})
