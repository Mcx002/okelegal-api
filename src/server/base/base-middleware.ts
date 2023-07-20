import { Logger } from 'winston'
import Provider from '../../provider'

export default abstract class BaseMiddleware {
    logger!: Logger
    abstract init(provider: Provider): void
}
