import { AuthProviderEnum, DevicePlatformEnum } from '../src/dto/auth.dto'
import { UserService } from '../src/server/services/user.service'

export const generateToken = async (userService: UserService) => {
    return userService.createSession(
        'james@gmail.com',
        AuthProviderEnum.EMAIL,
        {
            deviceId: 'testDevice',
            devicePlatformId: DevicePlatformEnum.WEB_BROWSER,
            clientIP: 'testIP',
        },
        'James'
    )
}
