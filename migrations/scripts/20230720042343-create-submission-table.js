'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('SubmissionStatus', {
            id: {
                type: Sequelize.SMALLINT,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING(16),
                allowNull: false,
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
        })

        await queryInterface.createTable('Submission', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            xid: {
                type: Sequelize.STRING(6),
                unique: true,
                allowNull: false,
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
            companyName: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            statusId: {
                type: Sequelize.SMALLINT,
                allowNull: false,
                references: {
                    model: 'SubmissionStatus',
                    key: 'id',
                },
            },
            history: {
                type: Sequelize.JSON,
                allowNull: false,
            },
        })

        await queryInterface.bulkInsert('SubmissionStatus', [
            {
                id: 1,
                name: 'Submitted',
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
            },
            {
                id: 2,
                name: 'Paid',
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
            },
            {
                id: 3,
                name: 'Valid',
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
            },
            {
                id: 4,
                name: 'Done',
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
            },
            {
                id: 5,
                name: 'Need Revision',
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
            },
        ])
    },

    async down(queryInterface, _) {
        await queryInterface.dropTable('Submission')
        await queryInterface.dropTable('SubmissionStatus')
    },
}
