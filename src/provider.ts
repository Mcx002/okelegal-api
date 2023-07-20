import { Logger } from 'winston'
import ControllerProvider from './server/controllers'
import ServiceProvider from './server/services'
import RepositoryProvider from './server/repositories'
import MiddlewareProvider from './server/middlewares'

export default class Provider {
    public logger: Logger
    public controller!: ControllerProvider
    public service!: ServiceProvider
    public repository!: RepositoryProvider
    public middleware!: MiddlewareProvider

    constructor(logger: Logger) {
        this.logger = logger
    }
}
