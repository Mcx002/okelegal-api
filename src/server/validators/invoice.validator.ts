import { MValidator } from '../../utils/validator'

export const postCreateInvoiceValidator = MValidator.buildSchema({
    paymentReceipt: {
        $$type: 'object|required',
        fileName: 'string|empty:false|required',
    },
    submissionXid: 'string|empty:false|required',
})
