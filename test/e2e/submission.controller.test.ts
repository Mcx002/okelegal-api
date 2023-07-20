import { afterAll, beforeAll } from '@jest/globals'
import { boot } from '../../src/boot'
import http from 'http'
import { generateToken } from '../token'
import request from 'supertest'
import { createProviderTest } from '../provider'
import { createLoggerTest } from '../logger'
import Provider from '../../src/provider'
import ModelProvider from '../../src/server/models'

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

    test('[POST /] Should Create Submission', async () => {
        const { service } = createProviderTest(db.dbContext.sequelize)
        const { accessSession } = await generateToken(service.userService)

        const data = {
            companyName: 'PT Kerja Bakti Sejahtera',
            address: 'Subang',
        }

        const res = await request(server)
            .post('/submissions')
            .set({
                Authorization: `Bearer ${accessSession.session.token}`,
            })
            .send(data)

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data.companyName).toBe(data.companyName)
    })
})
