import Provider from '../../provider'
import BaseController from '../base/base-controller'
import { ModuleController, PathController } from '../../decorators/metadata-keys'
import { Router } from 'express'
import { PathMetadata } from '../../decorators/controller.decorator'

// Controller Imports
import { HealthController } from './health.controller'
import { UserController } from './user.controller'
import { ClientError, MError } from '../../utils/errors'
import { ResponseData, ErrorResponse, ResponseRedirect } from '../../dto/common.dto'
import { AuthController } from './auth.controller'
import { SubmissionController } from './submission.controller'
import { InvoiceController } from './invoice.controller'
import { AdminAuthController } from './admin-auth.controller'
// -- Controller Import Port -- //

export default class ControllerProvider {
    provider!: Provider

    // Controller Store
    healthController = new HealthController()
    userController = new UserController()
    authController = new AuthController()
    submissionController = new SubmissionController()
    invoiceController = new InvoiceController()
    adminAuthController = new AdminAuthController()
    // -- Controller Initiation Port -- //

    init(provider: Provider): void {
        this.provider = { ...provider }
        this.provider.logger = provider.logger.child({ childLabel: 'Controller' })

        // Initiate Controller
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseController) {
                r.middlewares = this.provider.middleware
                r.logger = this.provider.logger
                r.init(this.provider)
                this.provider.logger.debug(`${k} initiated`)
            }
        })
    }
    getRouters = async (): Promise<Router> => {
        // Prepare route modules
        const moduleRoutes = Router()
        for (const item in this) {
            // skip if properties is not BaseController abstraction
            if (!(this[item] instanceof BaseController)) {
                continue
            }

            // Get target property
            const target = this[item] as BaseController

            // Get module metadata
            const module = Reflect.getMetadata(ModuleController, target)

            // Get path metadata
            const paths: PathMetadata[] | undefined = Reflect.getMetadata(PathController, target)

            // Create path routes
            const pathRoutes = Router()

            if (!paths) {
                continue
            }

            for (const path of paths) {
                this.provider.logger.info(`Prepare ${module}${path.path} Endpoint`)
                pathRoutes[path.method](path.path, async (req, res, next) => {
                    try {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const result: Optinal<ResponseData | ResponseRedirect> = await this[item][path.propertyKey](
                            req,
                            res,
                            next
                        )

                        if (result.redirect) {
                            res.redirect(result.redirect)
                            return
                        }

                        res.json({
                            message: 'OK',
                            data: result.data,
                        })
                    } catch (e) {
                        // Set Error
                        if (!(e instanceof MError)) {
                            res.status(500)
                            res.json({
                                message: 'Internal Error',
                                data: e,
                            })
                            return
                        }

                        const errorMessage: ErrorResponse = {
                            message: e.message,
                            data: e.data,
                        }

                        if (e instanceof ClientError) {
                            errorMessage.code = e.code
                        }

                        res.status(e.status || 500)
                        res.json(errorMessage)
                    }
                })
            }
            moduleRoutes.use(module, pathRoutes)
        }
        return moduleRoutes
    }
}
