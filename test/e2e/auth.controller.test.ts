import { afterAll, beforeAll } from '@jest/globals'
import { boot } from '../../src/boot'
import request from 'supertest'
import * as http from 'http'
import Provider from '../../src/provider'
import { createLoggerTest } from '../logger'
import ModelProvider from '../../src/server/models'
import { ClientAuth } from '../../src/server/models/client-auth.model'
import * as randomstring from 'randomstring'
import bcrypt from 'bcrypt'

const insertClientAuthSeed = async (): Promise<{ clientId: string; clientSecret: string }> => {
    const logger = createLoggerTest()

    // Prepare Dependencies Injection
    const provider = new Provider(logger)

    const db = new ModelProvider(provider)
    const connected = await db.dbContext.checkConnection()

    expect(connected).toBe(true)

    // Anonymous User Seed
    const clientId = randomstring.generate(12)
    const clientSecret = randomstring.generate(12)

    await ClientAuth.create({
        xid: randomstring.generate(4),
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        modifiedBy: { id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' },
        clientId: clientId,
        clientSecret: await bcrypt.hash(clientSecret, 10),
        clientTypeId: 2,
    })

    return { clientId, clientSecret }
}
const deleteClientAuthSeed = async (): Promise<{ clientId: string; clientSecret: string }> => {
    const logger = createLoggerTest()

    // Prepare Dependencies Injection
    const provider = new Provider(logger)

    const db = new ModelProvider(provider)
    const connected = await db.dbContext.checkConnection()

    expect(connected).toBe(true)

    // Anonymous User Seed
    const clientId = randomstring.generate(12)
    const clientSecret = randomstring.generate(12)

    await ClientAuth.destroy({
        where: {
            version: 1,
        },
    })

    return { clientId, clientSecret }
}
describe('Auth Controller E2E Test', () => {
    let server: http.Server

    beforeAll(async () => {
        const settings = await boot()
        server = settings.app.listen(settings.port)
    })

    afterAll(() => {
        server.close()
    })

    test('[/auth/anonymous] Should return Anonymous Session Result', async () => {
        const { clientId, clientSecret } = await insertClientAuthSeed()
        const userpass = `${clientId}:${clientSecret}`
        const encodedUserpass = btoa(userpass)

        const res = await request(server)
            .post('/auth/anonymous')
            .set({
                Authorization: `Basic ${encodedUserpass}`,
            })

        expect(res.body.data.session).toBeDefined()
        expect(res.body.data.scopes.length).toBe(2)

        await deleteClientAuthSeed()
    })

    test('[/auth/google] Should validate session anonymous customer', async () => {
        const { clientId, clientSecret } = await insertClientAuthSeed()
        const userpass = `${clientId}:${clientSecret}`
        const encodedUserpass = btoa(userpass)

        const res = await request(server)
            .post('/auth/anonymous')
            .set({
                Authorization: `Basic ${encodedUserpass}`,
            })

        expect(res.body.data.session).toBeDefined()
        expect(res.body.data.scopes.length).toBe(2)

        const res2 = await request(server)
            .post('/auth/google')
            .set({
                Authorization: `Bearer ${res.body.data.session.token}`,
            })

        console.log(res2)

        await deleteClientAuthSeed()
    })
})
