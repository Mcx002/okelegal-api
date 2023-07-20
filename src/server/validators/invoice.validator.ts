import { MValidator } from '../../utils/validator'

export const postCreateInvoiceValidator = MValidator.buildSchema({
    paymentReceipt: {
        $$type: 'object|required',
        fileName: 'string|required',
    },
    submissionXid: 'string|required',
})
