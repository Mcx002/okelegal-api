import BaseController from '../base/base-controller'
import { Module, Post } from '../../decorators/controller.decorator'
import Provider from '../../provider'
import { SubmissionService } from '../services/submission.service'
import { RequestWithSubject } from '../../utils/subject'
import { ValidateSession } from '../../decorators/auth.decorator'
import { Privilege } from '../constants/auth.constant'
import { SubmissionDto } from '../../dto/submission.dto'
import { MValidator } from '../../utils/validator'
import { postCreateSubmission } from '../validators/submission.validator'

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

        MValidator.validate(postCreateSubmission, payload)

        const data = await this.submissionService.createSubmission(payload)

        return {
            data,
        }
    }

    // -- Controller Function Port -- //
}
