import { Subject } from './auth.dto'

export interface GetDetailPayload {
    xid: string
}

export interface ErrorResponse {
    code?: string
    message: string
    data: unknown
}

export interface ResponseData<T> {
    data: T
    message?: string
}

export interface ResponseRedirect {
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

export interface ImageResult {
    fileName: string
    url?: string
}

export interface SubjectExtent {
    subject: Subject
}

export type ResponsePromise<T> = Promise<ResponseData<T>>
