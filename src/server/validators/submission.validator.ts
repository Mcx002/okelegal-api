import { MValidator } from '../../utils/validator'

export const postCreateSubmissionValidator = MValidator.buildSchema({
    companyName: 'string|empty:false|required',
    address: 'string|empty:false|required',
})

export const patchPaymentInvalidValidator = MValidator.buildSchema({
    xid: 'string|empty:false|required',
    version: 'number|required',
    notes: 'string|empty:false|required',
})

export const patchPaymentPaidValidator = MValidator.buildSchema({
    xid: 'string|empty:false|required',
    version: 'number|required',
})
