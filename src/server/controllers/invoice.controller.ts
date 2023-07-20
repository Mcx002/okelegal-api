import BaseController from '../base/base-controller'
import { Module, Post } from '../../decorators/controller.decorator'
import Provider from '../../provider'
import { InvoiceService } from '../services/invoice.service'
import { ValidateSession } from '../../decorators/auth.decorator'
import { Privilege } from '../constants/auth.constant'
import { getSubject, RequestWithSubject } from '../../utils/subject'
import { InvoiceDto } from '../../dto/invoice.dto'
import { MValidator } from '../../utils/validator'
import { postCreateInvoiceValidator } from '../validators/invoice.validator'
import { SubjectExtent } from '../../dto/common.dto'

@Module('/invoices')
export class InvoiceController extends BaseController {
    // services
    invoiceService!: InvoiceService

    init(provider: Provider) {
        const { service } = provider

        this.invoiceService = service.invoiceService
    }

    @Post('/')
    @ValidateSession([Privilege.User])
    async postCreateInvoice(req: RequestWithSubject) {
        const payload = req.body as InvoiceDto & SubjectExtent
        payload.subject = getSubject(req)

        MValidator.validate(postCreateInvoiceValidator, payload)

        const data = await this.invoiceService.createInvoice(payload)

        return {
            data,
        }
    }

    // -- Controller Function Port -- //
}
