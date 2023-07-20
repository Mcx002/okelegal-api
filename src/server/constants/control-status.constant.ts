import { EnumResult } from '../../dto/common.dto'

export enum ControlStatus {
    ACTIVE = 1,
    INACTIVE = 2,
    PENDING = 3,
    DRAFT = 4,
}

export const composeControlStatusResult = (id: ControlStatus): EnumResult => {
    let name
    switch (id) {
        case ControlStatus.ACTIVE:
            name = 'Active'
            break
        case ControlStatus.INACTIVE:
            name = 'Inactive'
            break
        case ControlStatus.PENDING:
            name = 'Pending'
            break
        case ControlStatus.DRAFT:
            name = 'Draft'
            break
        default:
            name = 'UNKNOWN'
    }

    return {
        id,
        name,
    }
}
