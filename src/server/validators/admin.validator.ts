import { MValidator } from '../../utils/validator'

export const postAdminLoginEmailValidator = MValidator.buildSchema({
    email: 'string|email|empty:false|required',
    password: 'string|empty:false|required',
    device: {
        $$type: 'object|required',
        deviceId: 'string|empty:false|required',
        devicePlatformId: 'number|empty:false|required',
        clientIP: 'string|empty:false|required',
        notificationChannelId: 'number|optional',
        notificationToken: 'string|optional',
    },
})
