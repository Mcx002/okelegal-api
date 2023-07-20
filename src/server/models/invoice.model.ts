import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { BaseAttributes, ModifiedBy } from '../../dto/common.dto'

export interface InvoiceAttributes extends BaseAttributes {
    id: number
    xid: string
    submissionId: number
    submissionXid: string
    paymentReceipt: string
}

export type InvoiceCreationAttributes = Optional<InvoiceAttributes, 'id'>

export class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> implements InvoiceAttributes {
    id!: number
    xid!: string
    version!: number
    createdAt!: Date
    updatedAt!: Date
    modifiedBy!: ModifiedBy
    submissionId!: number
    submissionXid!: string
    paymentReceipt!: string

    static initModel(sequelize: Sequelize) {
        Invoice.init(
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
                submissionId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'Submission',
                        key: 'id',
                    },
                },
                submissionXid: {
                    type: DataTypes.STRING(6),
                    allowNull: false,
                },
                paymentReceipt: {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'Invoice',
                timestamps: false,
            }
        )
    }
}
