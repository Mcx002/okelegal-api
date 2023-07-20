import { BaseAttributes, ModifiedBy } from '../dto/common.dto'

export function updateData<T extends BaseAttributes>(
    currentValues: T,
    updatedValues: Partial<Omit<T, keyof BaseAttributes>>,
    options: { modifiedBy?: ModifiedBy; timestamp?: Date } = {}
): Partial<T> {
    return Object.assign(updatedValues, {
        updatedAt: options.timestamp || new Date(),
        modifiedBy: options.modifiedBy || currentValues.modifiedBy,
        version: currentValues.version + 1,
    } as T)
}
