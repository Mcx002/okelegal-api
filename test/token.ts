import { AuthProviderEnum, DevicePlatformEnum } from '../src/dto/auth.dto'
import { UserService } from '../src/server/services/user.service'
import { createAdminCredentials } from './e2e/admin-auth.controller.test'
import { AdminService } from '../src/server/services/admin.service'

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

export const generateAdminToken = async (adminService: AdminService) => {
    const { email, password } = await createAdminCredentials()
    return adminService.createSession({
        email,
        password,
        device: {
            deviceId: '',
            devicePlatformId: DevicePlatformEnum.WEB_BROWSER,
            clientIP: 'testIP',
        },
        authProvider: AuthProviderEnum.EMAIL,
    })
}
