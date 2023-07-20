import BaseRepository from '../base/base-repository'
import Provider from '../../provider'
import { Logger } from 'winston'
import { Submission, SubmissionCreationAttributes } from '../models/submission.model'

export class SubmissionRepository extends BaseRepository {
    log!: Logger

    init(provider: Provider) {
        const { logger } = provider

        this.log = logger
    }

    insert = (row: SubmissionCreationAttributes) => {
        return Submission.create(row)
    }

    // -- Repository Function Port -- //
}
