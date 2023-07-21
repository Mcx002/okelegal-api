'use strict'

const randomstring = require('randomstring')
const bcrypt = require('bcrypt')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, _) {
        await queryInterface.bulkDelete('AdminAuth', {
            id: 1,
        })
        await queryInterface.bulkDelete('Admin', {
            id: 1,
        })

        const email = 'ujang@gmail.com'
        const password = randomstring.generate(16)
        const adminXid = randomstring.generate(6)
        await queryInterface.bulkInsert('Admin', [
            {
                id: 1,
                xid: adminXid,
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
                name: 'Ujang',
                email,
                statusId: 1,
            },
        ])
        await queryInterface.bulkInsert('AdminAuth', [
            {
                id: 1,
                xid: randomstring.generate(6),
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
                adminId: 1,
                adminXid,
                clientId: email,
                clientSecret: await bcrypt.hash(password, 10),
            },
        ])

        console.log('=== Admin Credentials ===')
        console.log(`clientId = ${email}`)
        console.log(`clientSecret = ${password}`)
    },

    async down(_, __) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
}
