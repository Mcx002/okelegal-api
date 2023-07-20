import { BaseResult } from './common.dto'

export interface UserDto extends BaseResult {
    xid: string
    name: string
    email: string
}
