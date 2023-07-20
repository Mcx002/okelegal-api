import BaseService from '../base/base-service'
import { convertSecondsToUptime } from '../../utils/date-formatter'
import { HealthDto } from '../../dto/health.dto'
import { myConfig } from '../../config'
import Provider from '../../provider'
import { Logger } from 'winston'

export class HealthService extends BaseService {
    log!: Logger
    init(provider: Provider) {
        this.log = provider.logger
    }

    getHealth = (): HealthDto => {
        // convert seconds to duration
        const uptime = convertSecondsToUptime(process.uptime())

        return {
            appName: myConfig.appName,
            version: myConfig.appVersion,
            uptime: uptime,
        }
    }
}
