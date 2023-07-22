import BaseService from '../base/base-service'
import { GetDetailPayload } from '../../dto/common.dto'
import { UserDto } from '../../dto/user.dto'
import { toUserModifier, UserAttributes, UserCreationAttributes } from '../models/user.model'
import Provider from '../../provider'
import { UserRepository } from '../repositories/user.repository'
import { errors, handleError } from '../constants/error.constant'
import * as randomstring from 'randomstring'
import { ServerError } from '../../utils/errors'
import { ControlStatus } from '../constants/control-status.constant'
import { DateTime } from 'luxon'
import {
    AuthProviderEnum,
    AuthSessionDevice,
    GetAuthSubjectPayload,
    PrepareUserDataSessionResult,
    Session,
    Subject,
    UserSessionResult,
} from '../../dto/auth.dto'
import { baseAttributesValue } from '../constants/common.constant'
import { Privilege, SubjectPrivileges, SubjectType } from '../constants/auth.constant'
import { myConfig } from '../../config'
import { AuthRepository } from '../repositories/auth.repository'
import { AuthSessionCreationAttributes } from '../models/auth-session.model'
import { dateToUnix } from '../../utils/date-formatter'
import { AuthService } from './auth.service'

export class UserService extends BaseService {
    userRepository!: UserRepository
    authRepository!: AuthRepository

    authService!: AuthService

    init(provider: Provider) {
        const { repository, service } = provider

        this.userRepository = repository.userRepository
        this.authRepository = repository.authRepository

        this.authService = service.authService
    }

    getDetailUser = async (payload: GetDetailPayload): Promise<UserDto> => {
        // Find User by xid
        const row = await this.userRepository.findByXid(payload.xid)
        if (!row) {
            throw errors.resourceNotFound
        }

        return this.composeUser(row)
    }

    composeUser = (row: UserAttributes): UserDto => {
        return {
            xid: row.xid,
            name: row.name,
            email: row.email,
            createdAt: dateToUnix(row.createdAt),
            updatedAt: dateToUnix(row.updatedAt),
            version: row.version,
        }
    }

    createUser = async (payload: UserDto): Promise<UserDto> => {
        // Prepare insert value
        const userForm: UserCreationAttributes = {
            createdAt: new Date(),
            id: 0,
            modifiedBy: {
                id: '',
                name: '',
                role: '',
            },
            statusId: ControlStatus.ACTIVE,
            updatedAt: new Date(),
            version: 1,
            xid: randomstring.generate(6),
            name: payload.name,
            email: payload.email,
        }

        // Persist insert data
        let row: UserAttributes
        try {
            row = await this.userRepository.insert(userForm)
        } catch (e) {
            // error handlers
            handleError.uniqueConstraint(e, 'Failed to insert user data, please try again')

            // default error
            throw new ServerError('Failed to insert user data')
        }

        // compose and return
        return this.composeUser(row)
    }

    composeUserSession = (
        userDto: UserDto,
        accessSession: Session,
        refreshSession: Session,
        privileges: Privilege[]
    ): UserSessionResult => {
        return {
            user: userDto,
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

    prepareDataSession = async (email: string, name?: string): Promise<PrepareUserDataSessionResult> => {
        const payload: UserCreationAttributes = {
            ...baseAttributesValue,
            statusId: ControlStatus.ACTIVE,
            xid: randomstring.generate(6),
            name: name ?? '',
            email: email,
        }
        const [user] = await this.userRepository.findOrCreateByEmail(email, payload)
        // Create session
        const sessionXid = randomstring.generate(6)
        const timestamp = new Date()
        const subjectType = SubjectType.User
        const privileges = SubjectPrivileges[subjectType]
        const subjectId = user.xid

        return {
            sessionXid,
            timestamp,
            subjectType,
            subjectId,
            privileges,
            user,
        }
    }

    createSession = async (
        email: string,
        authProvider: AuthProviderEnum,
        device: AuthSessionDevice,
        name?: string
    ): Promise<UserSessionResult> => {
        const { sessionXid, timestamp, subjectType, privileges, subjectId, user } = await this.prepareDataSession(
            email,
            name
        )

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

        await this.authRepository.createAuthSession(sessionPayload)

        const userDto = this.composeUser(user)

        // compose and return
        return this.composeUserSession(userDto, accessSession, refreshSession, privileges)
    }

    getAuthSubject = async (payload: GetAuthSubjectPayload): Promise<Subject> => {
        // Get user
        const user = await this.userRepository.findByXid(payload.subjectId)
        if (!user) {
            throw new Error('unexpected error, user is not found')
        }

        // Create subject
        return new Subject({
            subjectType: SubjectType.User,
            subjectId: user.xid,
            subjectRefId: user.id,
            modifier: toUserModifier(user),
            sessionId: payload.sessionId,
        })
    }
}
