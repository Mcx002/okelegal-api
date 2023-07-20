import Provider from '../../provider'
import { Logger } from 'winston'

export default abstract class BaseRepository {
    logger!: Logger
    abstract init(provider: Provider): void
}
