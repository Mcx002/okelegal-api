import Express from 'express'
import { errors } from '../server/constants/error.constant'
import { Subject } from '../dto/auth.dto'

export interface RequestWithSubject extends Express.Request {
    __subject?: Subject
}

export const getSubject = (req: RequestWithSubject): Subject => {
    const subject = req.__subject
    if (!subject) {
        throw errors.unauthorized.setMessage('Subject is undefined')
    }

    return subject
}
