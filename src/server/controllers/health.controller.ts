import BaseController from '../base/base-controller'
import { Get, Module } from '../../decorators/controller.decorator'
import Provider from '../../provider'
import { HealthService } from '../services/health.service'
import { ResponseData } from '../../dto/common.dto'
import { HealthDto } from '../../dto/health.dto'

@Module('/')
export class HealthController extends BaseController {
    healthService!: HealthService

    init(provider: Provider) {
        const { service } = provider
        this.healthService = service.healthService
    }

    @Get()
    getHealth(): ResponseData<HealthDto> {
        const data = this.healthService.getHealth()

        return { data }
    }
}
