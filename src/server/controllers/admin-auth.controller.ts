import BaseController from '../base/base-controller'
import { Module, Post } from '../../decorators/controller.decorator'
import Provider from '../../provider'
import { ValidateSession } from '../../decorators/auth.decorator'
import { Privilege } from '../constants/auth.constant'
import { AdminLoginPayload, AuthProviderEnum } from '../../dto/auth.dto'
import { ResponsePromise } from '../../dto/common.dto'
import { AdminSessionResult } from '../../dto/admin.dto'
import Express from 'express'
import { MValidator } from '../../utils/validator'
import { postAdminLoginEmailValidator } from '../validators/admin.validator'
import { AdminService } from '../services/admin.service'
import { captureClientIP } from '../../utils/express-utils'

@Module('/admin/auth')
export class AdminAuthController extends BaseController {
    // services
    adminService!: AdminService

    init(provider: Provider) {
        const { service } = provider

        this.adminService = service.adminService
    }

    @Post('/login')
    @ValidateSession([Privilege.AnonymousAdmin])
    async postLoginEmail(req: Express.Request): ResponsePromise<AdminSessionResult> {
        const payload = req.body as AdminLoginPayload
        payload.authProvider = AuthProviderEnum.EMAIL
        payload.device.clientIP = captureClientIP(req)

        MValidator.validate(postAdminLoginEmailValidator, payload)

        const data = await this.adminService.createSession(payload)

        return {
            data,
        }
    }

    // -- Controller Function Port -- //
}
