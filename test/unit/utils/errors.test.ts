import { ClientError, ServerError } from '../../../src/utils/errors'
import { errors } from '../../../src/server/constants/error.constant'
import { ErrorResponse } from '../../../src/dto/common.dto'

describe('Errors Utility', () => {
    test('Ensure ClientError Class Working well', () => {
        const error = new ClientError('Error')
        expect(error.message).toBe('Error')
        expect(error.status).toBe(400)
        expect(error.code).toBe('N/A')

        error.setStatus(404)
        expect(error.status).toBe(404)

        error.setCode('E_COMM_1')
        expect(error.code).toBe('E_COMM_1')
    })
    test('Ensure ServerError Class Working well', () => {
        const error = new ServerError('Error')
        expect(error.message).toBe('Error')
        expect(error.status).toBe(500)

        error.setStatus(502)
        expect(error.status).toBe(502)
    })
    test('Constant error is working', () => {
        const error = errors.resourceNotFound
        expect(error).toEqual(new ClientError('Resource Not Found').setCode('E_COMM_1'))
        expect(error.message).toBe('Resource Not Found')
    })
    test('Validate error data', () => {
        const e: ErrorResponse = new ServerError('Error')

        expect(e.data).toBeNull()

        const data = { xid: 'B31D' }
        const e2 = new ServerError('Error', data)

        expect(e2.data).toMatchObject(data)
    })
})
