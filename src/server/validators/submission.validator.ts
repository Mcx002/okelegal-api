import { MValidator } from '../../utils/validator'

export const postCreateSubmissionValidator = MValidator.buildSchema({
    companyName: 'string|empty:false|required',
    address: 'string|empty:false|required',
})
