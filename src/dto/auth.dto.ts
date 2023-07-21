import { Privilege, SubjectType } from '../server/constants/auth.constant'
import { KeyValueMetadata, ModifiedBy } from './common.dto'
import { Algorithm } from 'jsonwebtoken'
import { NotificationChannel } from '../server/constants/notification.constant'
import { UserDto } from './user.dto'
import { AuthSessionContent } from '../server/models/auth-session.model'
import { UserAttributes } from '../server/models/user.model'
import { AdminJoinAttributes } from '../server/models/admin.model'

export enum AuthProviderEnum {
    EMAIL = 'Email',
    GOOGLE = 'Google',
    APPLE = 'Apple',
}

export enum DevicePlatformEnum {
    ANDROID = 1,
    IOS,
    WEB_BROWSER,
}

export interface Session {
    token: string
    expiredAt: number
}

export interface JWTPayload {
    sub?: string
    jti?: string
    aud?: string | string[]
    signature?: string
    exp?: number
    str?: string
    ent?: SubjectType

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [k: string]: any
}

export interface IssueJWT_Payload {
    subject: string
    audience: string[]
    lifetime: number
    sessionXid: string
    subjectType?: SubjectType
    createdAt?: Date
    metadata?: Record<string, string>
}

export interface ValidateJWT_Payload {
    subject?: string
    audience: string[]
    algorithm?: Algorithm
}

export interface ValidateSessionOptions {
    token: string
    metadata: {
        clientIP: string
    }
    privileges: string[]
}

export interface SessionResult {
    session: Session
    scopes: Privilege[]
}

export class Subject {
    subjectType!: SubjectType
    subjectId!: string
    metadata!: KeyValueMetadata
    modifier!: ModifiedBy
    sessionId?: number
    subjectRefId?: number

    constructor(options: {
        subjectType: SubjectType
        subjectId?: string
        metadata?: KeyValueMetadata
        modifier?: ModifiedBy
        sessionId?: number
        subjectRefId?: number
    }) {
        Object.assign(this, options)

        if (!this.subjectId) {
            this.subjectId = 'ANONYMOUS'
        }

        if (!this.metadata) {
            this.metadata = {}
        }

        if (!this.modifier) {
            this.modifier = {
                id: this.subjectId,
                name: 'Anonymous',
                role: this.subjectType.toString(),
            }
        }
    }

    isAnonymous(): boolean {
        return !this.sessionId && !this.subjectRefId
    }
}

export interface GoogleSignInTokenResponse {
    access_token: string
    expires_in: number
    refresh_token: string
    scope: string
    token_type: 'Bearer'
    id_token: string
}

export interface GoogleJsonWebKey {
    keys: GoogleJsonWebKeyData[]
}

export interface GoogleJsonWebKeyData {
    kty: string
    use: string
    kid: string
    e: string
    alg: Algorithm
    n: string
}

export interface AuthSessionDevice {
    deviceId: string
    devicePlatformId: DevicePlatformEnum
    clientIP: string
    notificationChannelId?: NotificationChannel
    notificationToken?: string
}

export interface UserSessionResult {
    user: UserDto
    accessSession: SessionResult
    refreshSession: SessionResult
}

export interface AuthorizeGoogleAuthCodePayload {
    code: string
    device: AuthSessionDevice
}

export interface GetAuthSubjectPayload {
    sessionId: number
    subjectId: string
}

export interface CreateAccessSessionPayload {
    sessionXid: string
    subject: string
    subjectType: SubjectType
    lifetime: number
    refreshLifetime: number
    accessTokenAudience: Privilege[]
    refreshTokenAudience: Privilege[]
    timestamp: Date
}

export interface CreateAuthSessionPayload {
    sessionXid: string
    subjectType: SubjectType
    subjectId: string
    accessSessionExpiration: number
    authSessionContent: AuthSessionContent
}

export interface PrepareUserDataSessionResult {
    sessionXid: string
    timestamp: Date
    subjectType: SubjectType
    privileges: Privilege[]
    subjectId: string
    user: UserAttributes
}

export interface PrepareAdminDataSessionResult {
    sessionXid: string
    timestamp: Date
    subjectType: SubjectType
    privileges: Privilege[]
    subjectId: string
    admin: Required<AdminJoinAttributes>
}

export interface AdminLoginPayload {
    email: string
    password: string
    device: AuthSessionDevice
    authProvider: AuthProviderEnum
}
