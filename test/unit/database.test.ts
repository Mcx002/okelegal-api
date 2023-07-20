import ModelProvider from '../../src/server/models'
import { createLoggerTest } from '../logger'
import RepositoryProvider from '../../src/server/repositories'
import Provider from '../../src/provider'
import { UserAttributes, UserCreationAttributes } from '../../src/server/models/user.model'
import { afterAll } from '@jest/globals'
import { ServerError } from '../../src/utils/errors'
import { baseAttributesValue } from '../../src/server/constants/common.constant'
import { ControlStatus } from '../../src/server/constants/control-status.constant'
import * as randomstring from 'randomstring'

describe('Database test', () => {
    let repository: RepositoryProvider
    let db: ModelProvider

    beforeAll(async () => {
        const logger = createLoggerTest()

        // Prepare Dependencies Injection
        const provider = new Provider(logger)

        db = new ModelProvider(provider)
        const connected = await db.dbContext.checkConnection()

        expect(connected).toBe(true)

        repository = new RepositoryProvider()
        repository.init(provider)
    })

    afterAll(async () => {
        await db.dbContext.disconnect()

        await expect(async () => {
            await db.dbContext.checkConnection()
        }).rejects.toThrow(ServerError)
    })

    test('Create Data', async () => {
        const row: UserCreationAttributes = {
            ...baseAttributesValue,
            xid: randomstring.generate(6),
            name: 'Agung',
            email: 'agung@gmail.com',
            statusId: ControlStatus.ACTIVE,
        }

        const data = await repository.userRepository.insert(row)

        expect(data.xid).toBe(row.xid)
        expect(data).toMatchObject(row)

        await repository.userRepository.deleteById(data.id)
    })

    test('Get Data', async () => {
        const row: UserCreationAttributes = {
            ...baseAttributesValue,
            xid: randomstring.generate(6),
            name: 'Agung',
            email: 'agung@gmail.com',
            statusId: ControlStatus.ACTIVE,
        }

        const user = await repository.userRepository.insert(row)

        const data = await repository.userRepository.findByXid(row.xid)

        expect(data?.xid).toEqual(row.xid)

        await repository.userRepository.deleteById(user.id)
    })
    test('Update Data', async () => {
        const row: UserCreationAttributes = {
            ...baseAttributesValue,
            xid: randomstring.generate(6),
            name: 'Agung',
            email: 'agung@gmail.com',
            statusId: ControlStatus.ACTIVE,
        }

        const user = await repository.userRepository.insert(row)

        const updatedUser: UserAttributes = {
            ...baseAttributesValue,
            id: user.id,
            email: user.email,
            xid: user.xid,
            name: 'Agung nurjamal',
            statusId: ControlStatus.ACTIVE,
        }

        const data = await repository.userRepository.update(updatedUser)

        expect(data).toBe(1)

        await repository.userRepository.deleteById(user.id)
    })
})
