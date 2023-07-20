import Express from 'express'
import { Privilege } from '../server/constants/auth.constant'
import BaseController from '../server/base/base-controller'
import { RequestWithSubject } from '../utils/subject'

export function ValidateSession(privileges: Privilege[]) {
    return function (_: any, __: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value
        descriptor.value = async function (req: RequestWithSubject, res: Express.Response) {
            const { middlewares } = this as BaseController

            // Execute Validating Session on middleware
            await middlewares.authMiddleware.ValidateSession(req, privileges)

            return originalMethod.apply(this, [req, res])
        }
        return descriptor
    }
}
