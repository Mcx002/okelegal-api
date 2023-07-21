import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { BaseAttributes, ModifiedBy } from '../../dto/common.dto'

export interface AdminAuthAttributes extends BaseAttributes {
    id: number
    xid: string
    adminId: number
    adminXid: string
    clientId: string
    clientSecret: string
}

export type AdminAuthCreationAttributes = Optional<AdminAuthAttributes, 'id'>

export class AdminAuth extends Model<AdminAuthAttributes, AdminAuthCreationAttributes> implements AdminAuthAttributes {
    id!: number
    xid!: string
    version!: number
    createdAt!: Date
    updatedAt!: Date
    modifiedBy!: ModifiedBy
    adminId!: number
    adminXid!: string
    clientId!: string
    clientSecret!: string

    static initModel(sequelize: Sequelize) {
        AdminAuth.init(
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
                adminId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'Admin',
                        key: 'id',
                    },
                },
                adminXid: {
                    type: DataTypes.STRING(6),
                    allowNull: false,
                },
                clientId: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },
                clientSecret: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'AdminAuth',
                timestamps: false,
            }
        )
    }
}
