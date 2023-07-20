'use strict'

const randomstring = require('randomstring')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, _) {
        await queryInterface.bulkDelete('ClientAuth', {
            id: {
                [Op.in]: [1, 2],
            },
        })

        // Anonymous User Seed
        const userClientId = randomstring.generate(12)
        const userClientSecret = randomstring.generate(12)

        // Anonymous User Seed
        const adminClientId = randomstring.generate(12)
        const adminClientSecret = randomstring.generate(12)

        await queryInterface.bulkInsert('ClientAuth', [
            {
                id: 1,
                xid: randomstring.generate(4),
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
                clientId: userClientId,
                clientSecret: await bcrypt.hash(userClientSecret, 10),
                clientTypeId: 1,
            },
            {
                id: 2,
                xid: randomstring.generate(4),
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
                clientId: adminClientId,
                clientSecret: await bcrypt.hash(adminClientSecret, 10),
                clientTypeId: 2,
            },
        ])

        console.log('=== Anonymous User Credentials ===')
        console.log(`clientId = ${userClientId}`)
        console.log(`clientSecret = ${userClientSecret}`)

        console.log('=== Anonymous Admin Credentials ===')
        console.log(`clientId = ${adminClientId}`)
        console.log(`clientSecret = ${adminClientSecret}`)
    },
}
