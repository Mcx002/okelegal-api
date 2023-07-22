export function isInArray<T>(value: T, arr: T[]) {
    for (const x of arr) {
        if (value === x) {
            return true
        }
    }
    return false
}
