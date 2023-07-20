import { MValidator } from '../../utils/validator'

export const postCreateSubmissionValidator = MValidator.buildSchema({
    companyName: 'string|required',
    address: 'string|required',
})
