import { MValidator } from '../../utils/validator'

export const getGoogleAuthorizedValidator = MValidator.buildSchema({
    deviceId: 'string|required',
    devicePlatformId: 'number|required',
    clientIP: 'string|required',
    notificationChannelId: 'number|optional',
    notificationToken: 'string|optional',
})
