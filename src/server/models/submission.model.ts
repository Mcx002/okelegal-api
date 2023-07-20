import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { BaseAttributes, ModifiedBy } from '../../dto/common.dto'
import { SubmissionHistory } from '../../dto/submission.dto'
import { SubmissionStatus } from '../constants/submission.constant'

export interface SubmissionAttributes extends BaseAttributes {
    id: number
    xid: string
    companyName: string
    address: string
    statusId: SubmissionStatus
    history: SubmissionHistory[]
}

export type SubmissionCreationAttributes = Optional<SubmissionAttributes, 'id'>

export class Submission
    extends Model<SubmissionAttributes, SubmissionCreationAttributes>
    implements SubmissionAttributes
{
    id!: number
    xid!: string
    version!: number
    createdAt!: Date
    updatedAt!: Date
    modifiedBy!: ModifiedBy
    companyName!: string
    address!: string
    statusId!: SubmissionStatus
    history!: SubmissionHistory[]

    static initModel(sequelize: Sequelize) {
        Submission.init(
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
                companyName: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                address: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                statusId: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                    references: {
                        model: 'SubmissionStatus',
                        key: 'id',
                    },
                },
                history: {
                    type: DataTypes.JSON,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'Submission',
                timestamps: false,
            }
        )
    }
}
