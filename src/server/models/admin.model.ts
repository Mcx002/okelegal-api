import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { BaseAttributes, ModifiedBy } from '../../dto/common.dto'
import { ControlStatus } from '../constants/control-status.constant'
import { AdminAuthAttributes } from './admin-auth.model'

export interface AdminAttributes extends BaseAttributes {
    id: number
    xid: string
    name: string
    email: string
    statusId: ControlStatus
}

export interface AdminJoinAttributes extends AdminAttributes {
    adminAuth?: AdminAuthAttributes
}

export type AdminCreationAttributes = Optional<AdminAttributes, 'id'>

export class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
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
        Admin.init(
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
                    unique: true,
                },
                statusId: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                    references: {
                        model: 'ControlStatus',
                        key: 'id',
                    },
                },
            },
            {
                sequelize,
                tableName: 'Admin',
                timestamps: false,
            }
        )
    }
}
