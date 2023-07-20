export interface GetDetailPayload {
    xid: string
}

export interface ErrorResponse {
    code?: string
    message: string
    data: unknown
}

export interface ApiResponse {
    data: unknown
    message?: string
}

export interface RedirectResponse {
    redirect: string
}

export interface ModifiedBy {
    id: string
    name: string
    role: string
}

export interface BaseAttributes {
    createdAt: Date
    updatedAt: Date
    modifiedBy: ModifiedBy
    version: number
}

export interface EnumResult {
    id: number
    name: string
}

export interface BaseResult {
    createdAt?: number
    updatedAt?: number
    version?: number
}

export interface KeyValueMetadata {
    [k: string]: string | number | boolean
}
