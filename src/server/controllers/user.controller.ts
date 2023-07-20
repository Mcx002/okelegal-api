import BaseController from '../base/base-controller'
import { Module } from '../../decorators/controller.decorator'
import Provider from '../../provider'
import { UserService } from '../services/user.service'

@Module('/users')
export class UserController extends BaseController {
    userService!: UserService

    init(provider: Provider) {
        const { service } = provider

        this.userService = service.userService
    }
}
