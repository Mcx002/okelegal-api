import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { BaseAttributes, ModifiedBy } from '../../dto/common.dto'
import { ControlStatus } from '../constants/control-status.constant'

export interface UserAttributes extends BaseAttributes {
    id: number
    xid: string
    name: string
    email: string
    statusId: ControlStatus
}

export type UserCreationAttributes = Optional<UserAttributes, 'id'>

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id!: number
    xid!: string
    version!: number
    createdAt!: Date
    updatedAt!: Date
    modifiedBy!: ModifiedBy
    name!: string
    email!: string
    statusId!: ControlStatus

    static initModel(sequelize: Sequelize) {
        User.init(
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
                name: {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                },
                email: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                statusId: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'User',
                timestamps: false,
            }
        )
    }
}

export function toUserModifier(user: UserAttributes): ModifiedBy {
    return {
        id: `${user.xid}`,
        name: user.name || user.email,
        role: 'USER',
    }
}
