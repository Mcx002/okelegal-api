import { MValidator } from '../../utils/validator'

export const getGoogleAuthorizedValidator = MValidator.buildSchema({
    deviceId: 'string|empty:false|required',
    devicePlatformId: 'number|empty:false|required',
    clientIP: 'string|empty:false|required',
    notificationChannelId: 'number|optional',
    notificationToken: 'string|optional',
})
