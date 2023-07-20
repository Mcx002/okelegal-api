import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { BaseAttributes, ModifiedBy } from '../../dto/common.dto'
import { ClientType } from '../constants/auth.constant'

export interface ClientAuthAttributes extends BaseAttributes {
    id: number
    xid: string
    clientId: string
    clientSecret: string
    clientTypeId: ClientType
}

export type ClientAuthCreationAttributes = Optional<ClientAuthAttributes, 'id'>

export class ClientAuth
    extends Model<ClientAuthAttributes, ClientAuthCreationAttributes>
    implements ClientAuthAttributes
{
    id!: number
    xid!: string
    clientId!: string
    clientSecret!: string
    createdAt!: Date
    updatedAt!: Date
    modifiedBy!: ModifiedBy
    version!: number
    clientTypeId!: ClientType

    static initModel(sequelize: Sequelize) {
        ClientAuth.init(
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
                clientId: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                clientSecret: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                clientTypeId: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'ClientAuth',
                timestamps: false,
            }
        )
    }
}
