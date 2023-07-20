import request from 'supertest'
import EnvConfiguration from '../../src/config'
import { afterEach, beforeEach } from '@jest/globals'
import http from 'http'
import { boot } from '../../src/boot'

describe('Health Controller E2E Test', () => {
    let server: http.Server
    beforeEach(async () => {
        const settings = await boot()
        server = settings.app.listen(settings.port)
    })
    afterEach(() => {
        server.close()
    })
    test('[/] Should Get Health', async () => {
        const config = new EnvConfiguration()

        const res = await request(server).get('/')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data.appName).toEqual(config.appName)
    })
})
