import BaseRepository from '../base/base-repository'
import Provider from '../../provider'
import { Submission, SubmissionCreationAttributes } from '../models/submission.model'

export class SubmissionRepository extends BaseRepository {
    init(_: Provider) {
        return
    }

    insert = (row: SubmissionCreationAttributes) => {
        return Submission.create(row)
    }

    findByXid = (xid: string) => {
        return Submission.findOne({
            where: {
                xid,
            },
        })
    }

    // -- Repository Function Port -- //
}
