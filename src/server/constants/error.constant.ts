import { ClientError, ServerError } from '../../utils/errors'

export const errors = {
    // Common
    resourceNotFound: new ClientError('Resource Not Found').setCode('E_COMM_1'),

    // AUth
    unauthorized: new ClientError('Unauthorized').setStatus(401).setCode('E_AUTH_1'),
    sessionExpired: new ClientError('Session is expired').setStatus(401).setCode('E_AUTH_2'),

    // Server Errors
    googleHttpRequest: new ServerError('Failed connecting to google auth'),
}

export const handleError = {
    uniqueConstraint: (e: unknown, message = 'Error Unique Constraint') => {
        if (!(e instanceof Error)) {
            throw e
        }

        if (e.name === 'SequelizeUniqueConstraintError') {
            throw new ServerError(message)
        }
    },
}
