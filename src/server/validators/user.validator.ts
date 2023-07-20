import { MValidator } from '../../utils/validator'

export const createUserValidator = MValidator.buildSchema({
    name: 'string|min:3|max:50|required',
    email: 'string|email|required',
})
