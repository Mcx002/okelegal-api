import { BaseAttributes } from '../../dto/common.dto'

export const baseAttributesValue: BaseAttributes = {
    createdAt: new Date(),
    updatedAt: new Date(),
    modifiedBy: {
        id: 'SYSTEM',
        name: 'SYSTEM',
        role: 'SYSTEM',
    },
    version: 1,
}
