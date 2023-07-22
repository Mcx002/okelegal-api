import BaseService from '../base/base-service'
import Provider from '../../provider'
import { SubmissionDto } from '../../dto/submission.dto'
import { SubmissionAttributes, SubmissionCreationAttributes } from '../models/submission.model'
import { baseAttributesValue } from '../constants/common.constant'
import { SubmissionRepository } from '../repositories/submission.repository'
import { dateToUnix } from '../../utils/date-formatter'
import { composeSubmissionStatusResult, SubmissionStatus } from '../constants/submission.constant'
import { DateTime } from 'luxon'
import * as randomstring from 'randomstring'
import { errors } from '../constants/error.constant'
import { updateData } from '../../utils/data'
import { SubjectExtent } from '../../dto/common.dto'

export class SubmissionService extends BaseService {
    // repositories
    private submissionRepo!: SubmissionRepository

    init(provider: Provider) {
        const { repository } = provider

        this.submissionRepo = repository.submissionRepository
    }

    composeSubmissionDto = (row: SubmissionAttributes): SubmissionDto => {
        return {
            xid: row.xid,
            createdAt: dateToUnix(row.createdAt),
            updatedAt: dateToUnix(row.updatedAt),
            version: row.version,
            companyName: row.companyName,
            address: row.address,
            history: row.history,
            status: composeSubmissionStatusResult(row.statusId),
            notes: row.notes,
        }
    }

    createSubmission = async (payload: Pick<SubmissionDto, 'address' | 'companyName'>): Promise<SubmissionDto> => {
        const { address, companyName } = payload
        const creationRow: SubmissionCreationAttributes = {
            address,
            companyName,
            history: [],
            statusId: SubmissionStatus.Submitted,
            xid: randomstring.generate(6),
            ...baseAttributesValue,
        }

        const snapshot = this.composeSubmissionDto({ ...creationRow, id: 0 })

        creationRow.history.push({
            timestamp: DateTime.now().toUnixInteger(),
            statusId: snapshot.status.id,
            submissionSnapshot: {
                xid: snapshot.xid,
                status: snapshot.status,
                companyName: snapshot.companyName,
                address: snapshot.address,
                createdAt: snapshot.createdAt,
                updatedAt: snapshot.updatedAt,
                version: snapshot.version,
            },
        })

        const row = await this.submissionRepo.insert(creationRow)

        return this.composeSubmissionDto(row)
    }

    patchPaymentInvalid = async (payload: SubmissionDto & SubjectExtent) => {
        const { xid, subject, notes, version } = payload

        const row = await this.submissionRepo.findByXid(xid)
        if (!row) {
            throw errors.resourceNotFound
        }

        if (row.statusId !== SubmissionStatus.Submitted) {
            throw errors.invalidStatus
        }

        const submissionHistory = row.history

        // Update Submission
        const updateSubmissionValue = updateData<SubmissionAttributes>(
            row,
            {
                history: row.history,
                statusId: SubmissionStatus.PaymentInvalid,
                notes,
            },
            {
                modifiedBy: subject.modifier,
            }
        )
        const updatedSubmissionSnapshot = this.composeSubmissionDto(Object.assign(row, updateSubmissionValue))

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
                notes: updatedSubmissionSnapshot.notes,
            },
        })

        updateSubmissionValue.history = submissionHistory

        const update = await this.submissionRepo.update(row.id, updateSubmissionValue, version ?? 0)
        if (update === 0) {
            this.logger.info('No row updated')
        }

        return this.composeSubmissionDto(Object.assign(row, updateSubmissionValue))
    }

    // -- Service Function Port -- //
}
