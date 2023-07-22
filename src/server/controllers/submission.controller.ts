import BaseController from '../base/base-controller'
import { Module, Patch, Post } from '../../decorators/controller.decorator'
import Provider from '../../provider'
import { SubmissionService } from '../services/submission.service'
import { getSubject, RequestWithSubject } from '../../utils/subject'
import { ValidateSession } from '../../decorators/auth.decorator'
import { Privilege } from '../constants/auth.constant'
import { SubmissionDto } from '../../dto/submission.dto'
import { MValidator } from '../../utils/validator'
import { postCreateSubmissionValidator, patchPaymentInvalidValidator } from '../validators/submission.validator'
import { ResponsePromise, SubjectExtent } from '../../dto/common.dto'

@Module('/submissions')
export class SubmissionController extends BaseController {
    // services
    submissionService!: SubmissionService

    init(provider: Provider) {
        const { service } = provider

        this.submissionService = service.submissionService
    }

    @Post('/')
    @ValidateSession([Privilege.User])
    async postCreateSubmission(req: RequestWithSubject) {
        const payload = req.body as SubmissionDto

        MValidator.validate(postCreateSubmissionValidator, payload)

        const data = await this.submissionService.createSubmission(payload)

        return {
            data,
        }
    }

    @Patch('/:xid/payment-invalid')
    @ValidateSession([Privilege.Admin])
    async patchPaymentInvalid(req: RequestWithSubject): ResponsePromise<SubmissionDto> {
        const payload = req.body as SubmissionDto & SubjectExtent
        payload.xid = req.params.xid
        payload.subject = getSubject(req)

        MValidator.validate(patchPaymentInvalidValidator, payload)

        const data = await this.submissionService.patchPaymentInvalid(payload)

        return {
            data,
        }
    }

    // -- Controller Function Port -- //
}
