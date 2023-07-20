import { afterEach, beforeEach } from '@jest/globals'
import { boot } from '../../src/boot'
import http from 'http'
import { generateToken } from '../token'
import request from 'supertest'

describe('Submission Controller E2E Test', () => {
    let server: http.Server
    beforeEach(async () => {
        const settings = await boot()
        server = settings.app.listen(settings.port)
    })
    afterEach(() => {
        server.close()
    })

    test('[POST /] Should Create Submission', async () => {
        const { accessSession } = await generateToken()

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
