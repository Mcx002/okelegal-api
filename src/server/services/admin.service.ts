import BaseService from '../base/base-service'
import Provider from '../../provider'
import { dateToUnix } from '../../utils/date-formatter'
import { AdminAttributes } from '../models/admin.model'
import { AdminDto, AdminSessionResult } from '../../dto/admin.dto'
import {
    AdminLoginPayload,
    GetAuthSubjectPayload,
    PrepareAdminDataSessionResult,
    Session,
    Subject,
} from '../../dto/auth.dto'
import { Privilege, SubjectPrivileges, SubjectType } from '../constants/auth.constant'
import randomstring from 'randomstring'
import { AdminRepository } from '../repositories/admin.repository'
import { errors } from '../constants/error.constant'
import { myConfig } from '../../config'
import { AuthSessionCreationAttributes } from '../models/auth-session.model'
import { baseAttributesValue } from '../constants/common.constant'
import { DateTime } from 'luxon'
import { AuthService } from './auth.service'
import { AuthRepository } from '../repositories/auth.repository'
import bcrypt from 'bcrypt'
import { toUserModifier } from '../models/user.model'

export class AdminService extends BaseService {
    // repositories
    private adminRepo!: AdminRepository
    private authRepo!: AuthRepository

    private authService!: AuthService

    init(provider: Provider) {
        const { repository, service } = provider

        this.adminRepo = repository.adminRepository
        this.authRepo = repository.authRepository

        this.authService = service.authService
    }

    composeAdmin = (row: AdminAttributes): AdminDto => {
        return {
            xid: row.xid,
            name: row.name,
            email: row.email,
            createdAt: dateToUnix(row.createdAt),
            updatedAt: dateToUnix(row.updatedAt),
            version: row.version,
        }
    }

    composeAdminSession = (
        adminDto: AdminDto,
        accessSession: Session,
        refreshSession: Session,
        privileges: Privilege[]
    ): AdminSessionResult => {
        return {
            admin: adminDto,
            accessSession: {
                session: accessSession,
                scopes: privileges,
            },
            refreshSession: {
                session: refreshSession,
                scopes: [Privilege.UserRefreshToken],
            },
        }
    }

    prepareDataSession = async (email: string): Promise<PrepareAdminDataSessionResult> => {
        const admin = await this.adminRepo.findByEmailJoinAdminAuth(email)
        if (!admin) {
            throw errors.unauthorized
        }
        if (admin.adminAuth === undefined) {
            throw errors.unauthorized
        }

        // Create session
        const sessionXid = randomstring.generate(6)
        const timestamp = new Date()
        const subjectType = SubjectType.Admin
        const privileges = SubjectPrivileges[subjectType]
        const subjectId = admin.xid

        return {
            sessionXid,
            timestamp,
            subjectType,
            subjectId,
            privileges,
            admin: Object.assign(admin, { adminAuth: admin.adminAuth }),
        }
    }

    createSession = async (payload: AdminLoginPayload): Promise<AdminSessionResult> => {
        const { email, password, authProvider, device } = payload
        const { sessionXid, timestamp, subjectType, privileges, subjectId, admin } = await this.prepareDataSession(
            email
        )

        // validate password
        const valid = await bcrypt.compare(password, admin.adminAuth.clientSecret)
        if (!valid) {
            throw errors.unauthorized
        }

        const { accessSession, refreshSession } = this.authService.createAccessSession({
            sessionXid,
            subject: subjectId,
            subjectType: subjectType,
            lifetime: myConfig.lifetimeUser,
            refreshLifetime: myConfig.lifetimeUserRefresh,
            accessTokenAudience: SubjectPrivileges[subjectType],
            refreshTokenAudience: [Privilege.UserRefreshToken],
            timestamp,
        })

        const sessionPayload: AuthSessionCreationAttributes = {
            ...baseAttributesValue,
            xid: sessionXid,
            subjectTypeId: subjectType,
            notificationChannelId: device.notificationChannelId,
            notificationToken: device.notificationToken,
            subjectId,
            expiredAt: DateTime.fromSeconds(accessSession.expiredAt).toJSDate(),
            content: {
                device,
                authProvider,
            },
        }

        await this.authRepo.createAuthSession(sessionPayload)

        const adminDto = this.composeAdmin(admin)

        // compose and return
        return this.composeAdminSession(adminDto, accessSession, refreshSession, privileges)
    }

    getAuthSubject = async (payload: GetAuthSubjectPayload): Promise<Subject> => {
        // Get user
        const admin = await this.adminRepo.findByXid(payload.subjectId)
        if (!admin) {
            throw new Error('unexpected error, user is not found')
        }

        // Create subject
        return new Subject({
            subjectType: SubjectType.User,
            subjectId: admin.xid,
            subjectRefId: admin.id,
            modifier: toUserModifier(admin),
            sessionId: payload.sessionId,
        })
    }

    // -- Service Function Port -- //
}
