import {
    Delete,
    Get,
    Module,
    Patch,
    PathMetadata,
    Post,
    Put,
    RestMethod,
} from '../../../src/decorators/controller.decorator'
import { ModuleController, PathController } from '../../../src/decorators/metadata-keys'

describe('Controller Decorator Test', () => {
    const pathDecoratorTest = (
        endpoint: (target: any, propertyKey: string, _: PropertyDescriptor) => void,
        path: string,
        restMethod: RestMethod
    ) => {
        // create mock class
        const obj = class TestDecoratorClass {
            test() {
                return ''
            }
        }

        // create new obj
        const target = new obj()

        // inject decorator
        endpoint(target, 'test', { writable: false, enumerable: false, configurable: true })

        // get defined metadata
        const metadata: PathMetadata[] = Reflect.getMetadata(PathController, target)

        expect(metadata.length).toBe(1)
        expect(metadata[0].method).toBe(restMethod)
        expect(metadata[0].path).toBe(path)
        expect(metadata[0].propertyKey).toBe('test')
    }
    test('Should save module to metadata', () => {
        // set module name
        const moduleName = 'decorator-test'

        // initiate decorator
        const module = Module(moduleName)

        // create mock class
        const obj = class TestDecoratorClass {}

        // inject decorator
        module(obj)

        // create new obj
        const target = new obj()

        // get defined metadata
        const metadata = Reflect.getMetadata(ModuleController, target)

        expect(metadata).toBe(moduleName)
    })
    test('Should Add path with method get to metadata', () => {
        // set path
        const path = '/decorator-test-path'

        // initiate decorator
        const endpoint = Get(path)

        pathDecoratorTest(endpoint, path, RestMethod.Get)
    })
    test('Should Add path with method get to metadata', () => {
        // initiate decorator
        const endpoint = Get()

        pathDecoratorTest(endpoint, '', RestMethod.Get)
    })
    test('Should Add path with method post to metadata', () => {
        // set path
        const path = '/decorator-test-path'

        // initiate decorator
        const endpoint = Post(path)

        pathDecoratorTest(endpoint, path, RestMethod.Post)
    })
    test('Should Add empty path with method post to metadata', () => {
        // initiate decorator
        const endpoint = Post()

        pathDecoratorTest(endpoint, '', RestMethod.Post)
    })
    test('Should Add path with method put to metadata', () => {
        // set path
        const path = '/decorator-test-path'

        // initiate decorator
        const endpoint = Put(path)

        pathDecoratorTest(endpoint, path, RestMethod.Put)
    })
    test('Should Add empty path with method put to metadata', () => {
        // initiate decorator
        const endpoint = Put()

        pathDecoratorTest(endpoint, '', RestMethod.Put)
    })
    test('Should Add path with method delete to metadata', () => {
        // set path
        const path = '/decorator-test-path'

        // initiate decorator
        const endpoint = Delete(path)

        pathDecoratorTest(endpoint, path, RestMethod.Delete)
    })
    test('Should Add empty path with method delete to metadata', () => {
        // initiate decorator
        const endpoint = Delete()

        pathDecoratorTest(endpoint, '', RestMethod.Delete)
    })
    test('Should Add path with method patch to metadata', () => {
        // set path
        const path = '/decorator-test-path'

        // initiate decorator
        const endpoint = Patch(path)

        pathDecoratorTest(endpoint, path, RestMethod.Patch)
    })
    test('Should Add empty path with method patch to metadata', () => {
        // initiate decorator
        const endpoint = Patch()

        pathDecoratorTest(endpoint, '', RestMethod.Patch)
    })
})
