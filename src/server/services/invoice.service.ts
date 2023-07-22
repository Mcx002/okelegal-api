import BaseService from '../base/base-service'
import Provider from '../../provider'
import { InvoiceRepository } from '../repositories/invoice.repository'
import { InvoiceDto } from '../../dto/invoice.dto'
import { InvoiceAttributes, InvoiceCreationAttributes } from '../models/invoice.model'
import { SubmissionRepository } from '../repositories/submission.repository'
import { errors } from '../constants/error.constant'
import { baseAttributesValue } from '../constants/common.constant'
import * as randomstring from 'randomstring'
import { dateToUnix } from '../../utils/date-formatter'
import { SubjectExtent } from '../../dto/common.dto'
import { SubmissionService } from './submission.service'

export class InvoiceService extends BaseService {
    // repositories
    invoiceRepo!: InvoiceRepository
    submissionRepo!: SubmissionRepository

    // services
    submissionService!: SubmissionService

    init(provider: Provider) {
        const { repository, service } = provider

        this.invoiceRepo = repository.invoiceRepository
        this.submissionRepo = repository.submissionRepository

        this.submissionService = service.submissionService
    }

    composeInvoiceResult = (row: InvoiceAttributes): InvoiceDto => {
        // TODO: Retrieve Image URL
        return {
            xid: row.xid,
            paymentReceipt: {
                fileName: row.paymentReceipt,
                url: '',
            },
            submissionXid: row.submissionXid,
            createdAt: dateToUnix(row.createdAt),
            updatedAt: dateToUnix(row.updatedAt),
            version: row.version,
        }
    }

    createInvoice = async (payload: InvoiceDto & SubjectExtent): Promise<InvoiceDto> => {
        const { submissionXid, paymentReceipt } = payload

        // check submission xid
        const submission = await this.submissionRepo.findByXid(submissionXid)
        if (!submission) {
            throw errors.resourceNotFound
        }

        const creationRow: InvoiceCreationAttributes = {
            ...baseAttributesValue,
            xid: randomstring.generate(6),
            submissionId: submission.id,
            submissionXid: submission.xid,
            paymentReceipt: paymentReceipt.fileName,
        }

        const row = await this.invoiceRepo.insert(creationRow)

        return this.composeInvoiceResult(row)
    }

    // -- Service Function Port -- //
}
