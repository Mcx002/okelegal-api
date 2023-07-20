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
import { SubmissionAttributes } from '../models/submission.model'
import { SubjectExtent } from '../../dto/common.dto'
import { updateData } from '../../utils/data'
import { SubmissionService } from './submission.service'
import { SubmissionStatus } from '../constants/submission.constant'
import { DateTime } from 'luxon'

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
        const { submissionXid, paymentReceipt, subject } = payload

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

        const submissionHistory = submission.history

        // Update Submission
        const updateSubmissionValue = updateData<SubmissionAttributes>(
            submission,
            {
                history: submission.history,
                statusId: SubmissionStatus.Paid,
            },
            {
                modifiedBy: subject.modifier,
            }
        )
        const updatedSubmissionSnapshot = this.submissionService.composeSubmissionDto(
            Object.assign(submission, updateSubmissionValue)
        )

        submissionHistory.push({
            timestamp: DateTime.now().toUnixInteger(),
            statusId: updatedSubmissionSnapshot.status.id,
            submissionSnapshot: {
                xid: updatedSubmissionSnapshot.xid,
                status: updatedSubmissionSnapshot.status,
                companyName: updatedSubmissionSnapshot.companyName,
                address: updatedSubmissionSnapshot.address,
                createdAt: updatedSubmissionSnapshot.createdAt,
                updatedAt: updatedSubmissionSnapshot.updatedAt,
                version: updatedSubmissionSnapshot.version,
            },
        })

        updateSubmissionValue.history = submissionHistory

        const row = await this.invoiceRepo.insert(creationRow, updateSubmissionValue)

        return this.composeInvoiceResult(row)
    }

    // -- Service Function Port -- //
}
