import Provider from '../../provider'
import { Logger } from 'winston'
import MiddlewareProvider from '../middlewares'

export default abstract class BaseController {
    middlewares!: MiddlewareProvider
    logger!: Logger

    abstract init(provider: Provider): void
}
