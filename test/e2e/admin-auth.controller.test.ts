import { afterAll, beforeAll } from '@jest/globals'
import { boot } from '../../src/boot'
import http from 'http'
import request from 'supertest'
import { createProviderTest } from '../provider'
import { createLoggerTest } from '../logger'
import Provider from '../../src/provider'
import ModelProvider from '../../src/server/models'
import { insertClientAuthSeed } from './auth.controller.test'
import { Admin } from '../../src/server/models/admin.model'
import { AdminAuth } from '../../src/server/models/admin-auth.model'
import randomstring from 'randomstring'
import bcrypt from 'bcrypt'

export const createAdminCredentials = async (): Promise<{ email: string; password: string }> => {
    const email = 'adm@gmail.com'
    const password = 'hoaxmen'
    const adminXid = 'admXid'

    await Admin.findOrCreate({
        where: { id: 1 },
        defaults: {
            id: 1,
            xid: adminXid,
            version: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            modifiedBy: { id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' },
            name: 'Ujang',
            email,
            statusId: 1,
        },
    })

    await AdminAuth.findOrCreate({
        where: { id: 1 },
        defaults: {
            id: 1,
            xid: randomstring.generate(6),
            version: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            modifiedBy: { id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' },
            adminId: 1,
            adminXid,
            clientId: email,
            clientSecret: await bcrypt.hash(password, 10),
        },
    })

    return { email, password }
}

describe('Submission Controller E2E Test', () => {
    let server: http.Server
    let db: ModelProvider
    beforeAll(async () => {
        const settings = await boot()
        server = settings.app.listen(settings.port)

        const logger = createLoggerTest()

        // Prepare Dependencies Injection
        const provider = new Provider(logger)

        db = new ModelProvider(provider)
    })
    afterAll(async () => {
        await db.dbContext.disconnect()
        server.close()
    })

    test('[POST /admin/auth/login] Should Create Admin Session', async () => {
        const { service } = createProviderTest(db.dbContext.sequelize)
        const { clientId, clientSecret } = await insertClientAuthSeed()

        const { session } = await service.authService.createClientAuthSession(clientId, clientSecret)

        const { email, password } = await createAdminCredentials()

        const data = {
            email,
            password,
            device: {
                deviceId: 'PHONE',
                devicePlatformId: 1,
                notificationChannelId: 1,
                notificationToken: '',
            },
        }

        const res = await request(server)
            .post('/admin/auth/login')
            .set({
                Authorization: `Bearer ${session.token}`,
            })
            .send(data)

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data.admin.email).toBe(email)
        expect(res.body.data.accessSession.session.token.length > 1).toBe(true)
    })
})
