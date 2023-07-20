import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { BaseAttributes, ModifiedBy } from '../../dto/common.dto'
import { SubjectType } from '../constants/auth.constant'
import { NotificationChannel } from '../constants/notification.constant'
import { AuthSessionDevice } from '../../dto/auth.dto'

export interface AuthSessionContent {
    authProvider: string
    device: AuthSessionDevice
}

export interface AuthSessionAttributes extends BaseAttributes {
    id: number
    xid: string
    subjectId: string
    subjectTypeId: SubjectType
    content: AuthSessionContent
    notificationChannelId?: NotificationChannel
    notificationToken?: string
    expiredAt: Date
}

export type AuthSessionCreationAttributes = Optional<AuthSessionAttributes, 'id'>

export class AuthSession
    extends Model<AuthSessionAttributes, AuthSessionCreationAttributes>
    implements AuthSessionAttributes
{
    id!: number
    xid!: string
    version!: number
    createdAt!: Date
    updatedAt!: Date
    modifiedBy!: ModifiedBy
    subjectId!: string
    subjectTypeId!: SubjectType
    content!: AuthSessionContent
    notificationChannelId?: NotificationChannel
    notificationToken?: string
    expiredAt!: Date

    static initModel(sequelize: Sequelize) {
        AuthSession.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                xid: {
                    type: DataTypes.STRING,
                    unique: true,
                    allowNull: false,
                },
                version: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                modifiedBy: {
                    type: DataTypes.JSON,
                    allowNull: false,
                },
                subjectId: {
                    type: DataTypes.STRING(35),
                    allowNull: false,
                },
                subjectTypeId: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                },
                content: {
                    type: DataTypes.JSON,
                    allowNull: false,
                },
                notificationChannelId: {
                    type: DataTypes.SMALLINT,
                    allowNull: true,
                },
                notificationToken: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                expiredAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'AuthSession',
                timestamps: false,
            }
        )
    }
}
