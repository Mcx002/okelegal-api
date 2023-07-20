import { BaseResult, ImageResult } from './common.dto'

export interface InvoiceDto extends BaseResult {
    xid: string
    submissionXid: string
    paymentReceipt: ImageResult
}
