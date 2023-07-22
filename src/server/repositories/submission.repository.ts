import BaseRepository from '../base/base-repository'
import Provider from '../../provider'
import { Submission, SubmissionAttributes, SubmissionCreationAttributes } from '../models/submission.model'

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

    update = async (id: number, row: Partial<SubmissionAttributes>, version: number): Promise<number> => {
        const update = await Submission.update(row, {
            where: {
                id,
                version,
            },
        })

        return update[0]
    }

    // -- Repository Function Port -- //
}
