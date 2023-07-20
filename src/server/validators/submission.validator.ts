import { MValidator } from '../../utils/validator'

export const postCreateSubmission = MValidator.buildSchema({
    companyName: 'string|required',
    address: 'string|required',
})
