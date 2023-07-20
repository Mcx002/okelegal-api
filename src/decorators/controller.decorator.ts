/* eslint-disable */
import 'reflect-metadata'
import {ModuleController, PathController} from './metadata-keys';

export enum RestMethod {
    Get = 'get',
    Post = 'post',
    Put = 'put',
    Delete = 'delete',
    Patch = 'patch'
}

export type PathMetadata = {
    method: RestMethod
    path: string,
    propertyKey: string
}

export function Module(module: string) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (constructor: Function) {
        Reflect.defineMetadata(ModuleController, module, constructor.prototype)
    }
}

const addPath = (method: RestMethod, path: string, target: any, propertyKey: string) => {
    // Get Metadata Paths
    let paths: PathMetadata[] = Reflect.getMetadata(PathController, target)
    if (!paths) {
        // Init if paths undefined
        paths = []
    }

    // Push new path
    paths.push({
        method,
        path,
        propertyKey
    })

    // Re-Define Metadata
    Reflect.defineMetadata(PathController, paths, target)
}

export function Get(path = '') {
    return function (target: any, propertyKey: string, _: PropertyDescriptor) {
        addPath(RestMethod.Get, path, target, propertyKey)
    }
}

export function Post(path = '') {
    return function (target: any, propertyKey: string, _: PropertyDescriptor) {
        addPath(RestMethod.Post, path, target, propertyKey)
    }
}

export function Put(path = '') {
    return function (target: any, propertyKey: string, _: PropertyDescriptor) {
        addPath(RestMethod.Put, path, target, propertyKey)
    }
}

export function Delete(path = '') {
    return function (target: any, propertyKey: string, _: PropertyDescriptor) {
        addPath(RestMethod.Delete, path, target, propertyKey)
    }
}

export function Patch(path = '') {
    return function (target: any, propertyKey: string, _: PropertyDescriptor) {
        addPath(RestMethod.Patch, path, target, propertyKey)
    }
}