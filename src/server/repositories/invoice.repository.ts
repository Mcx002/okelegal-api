import BaseRepository from '../base/base-repository'
import Provider from '../../provider'
import { Invoice, InvoiceAttributes, InvoiceCreationAttributes } from '../models/invoice.model'
import { Sequelize } from 'sequelize'
import { ServerError } from '../../utils/errors'
import { Submission, SubmissionAttributes } from '../models/submission.model'

export class InvoiceRepository extends BaseRepository {
    private conn!: Sequelize

    init({ repository }: Provider) {
        this.conn = repository.conn
    }

    insert = async (
        row: InvoiceCreationAttributes,
        submission: Partial<SubmissionAttributes>
    ): Promise<InvoiceAttributes> => {
        const t = await this.conn.transaction()
        try {
            const invoice = await Invoice.create(row, { transaction: t })

            // update submission status to paid
            const update = await Submission.update(submission, {
                where: {
                    xid: invoice.submissionXid,
                },
                transaction: t,
            })

            this.logger.info(update[0])

            await t.commit()
            return invoice
        } catch (e: unknown) {
            await t.rollback()
            throw new ServerError('Failed when trying to insert invoice', e)
        }
    }

    // -- Repository Function Port -- //
}
