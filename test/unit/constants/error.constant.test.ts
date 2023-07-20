import { handleError } from '../../../src/server/constants/error.constant'
import { ServerError } from '../../../src/utils/errors'

describe('Error Constant Test', () => {
    test('Should Return Error Unique Constraint', () => {
        const e = new Error('Error Unique Constraint')
        e.name = 'SequelizeUniqueConstraintError'

        expect(() => {
            handleError.uniqueConstraint(e)
        }).toThrow(new ServerError('Error Unique Constraint'))
    })
})
