import { BaseResult, EnumResult } from './common.dto'

export interface SubmissionDto extends BaseResult {
    xid: string
    companyName: string
    address: string
    status: EnumResult
    history: SubmissionHistory[]
    notes?: string
}

export interface SubmissionHistory {
    timestamp: number
    statusId: number
    submissionSnapshot: Omit<SubmissionDto, 'history'>
}
