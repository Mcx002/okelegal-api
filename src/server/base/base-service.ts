import Provider from '../../provider'
import { Logger } from 'winston'

export default abstract class BaseService {
    logger!: Logger
    abstract init(provider: Provider): void
}
