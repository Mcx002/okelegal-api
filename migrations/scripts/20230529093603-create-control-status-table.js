'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ControlStatus', {
            id: {
                type: Sequelize.SMALLINT,
                autoIncrement: true,
                primaryKey: true,
            },
            version: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            modifiedBy: {
                type: Sequelize.JSON,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(10),
                allowNull: false,
            },
        })

        await queryInterface.bulkInsert('ControlStatus', [
            {
                id: 1,
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
                name: 'Active',
            },
            {
                id: 2,
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
                name: 'Inactive',
            },
            {
                id: 3,
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
                name: 'Pending',
            },
            {
                id: 4,
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
                name: 'Draft',
            },
        ])
    },

    async down(queryInterface, _) {
        await queryInterface.dropTable('ControlStatus')
    },
}
