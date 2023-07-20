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

    // -- Service Function Port -- //
}
