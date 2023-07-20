import { createProviderTest } from './provider'
import { AuthProviderEnum, DevicePlatformEnum } from '../src/dto/auth.dto'

export const generateToken = async () => {
    const { service } = createProviderTest()

    return service.userService.createSession(
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
