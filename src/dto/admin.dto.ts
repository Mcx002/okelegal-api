import { SessionResult } from './auth.dto'
import { BaseResult } from './common.dto'

export interface AdminDto extends BaseResult {
    xid: string
    name: string
    email: string
}

export interface AdminSessionResult {
    admin: AdminDto
    accessSession: SessionResult
    refreshSession: SessionResult
}
