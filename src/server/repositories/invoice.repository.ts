import BaseRepository from '../base/base-repository'
import Provider from '../../provider'
import { Invoice, InvoiceAttributes, InvoiceCreationAttributes } from '../models/invoice.model'

export class InvoiceRepository extends BaseRepository {
    init(_: Provider) {
        return
    }

    insert = async (row: InvoiceCreationAttributes): Promise<InvoiceAttributes> => {
        return Invoice.create(row)
    }

    // -- Repository Function Port -- //
}
