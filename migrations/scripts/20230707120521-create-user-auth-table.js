'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ClientType', {
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
                type: Sequelize.STRING(20),
                allowNull: false,
            },
        })

        await queryInterface.createTable('NotificationChannel', {
            id: {
                type: Sequelize.INTEGER,
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
                type: Sequelize.STRING(50),
                allowNull: false,
            },
        })

        // Table for anonymous user
        await queryInterface.createTable('ClientAuth', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            xid: {
                type: Sequelize.STRING(4),
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
            clientId: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            clientSecret: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            clientTypeId: {
                type: Sequelize.SMALLINT,
                allowNull: false,
                references: {
                    model: 'ClientType',
                    key: 'id',
                },
            },
        })

        // Table for user credentials
        await queryInterface.createTable('UserAuth', {
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
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            clientId: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            clientSecret: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
        })

        await queryInterface.createTable('AuthSession', {
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
            subjectId: {
                type: Sequelize.STRING(35),
                allowNull: false,
                description: 'Should be like User External Id',
            },
            subjectTypeId: {
                type: Sequelize.SMALLINT,
                allowNull: false,
            },
            content: {
                type: Sequelize.JSON,
                allowNull: false,
                description: 'Object with attributes: authProvider, device (id <- literally deviceId, platform)',
            },
            notificationChannelId: {
                type: Sequelize.SMALLINT,
                allowNull: true,
                references: {
                    model: 'NotificationChannel',
                    key: 'id',
                },
            },
            notificationToken: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            expiredAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        })

        // Seed Client Type
        await queryInterface.bulkInsert('ClientType', [
            {
                id: 1,
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
                name: 'Customer Web App',
            },
            {
                id: 2,
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
                name: 'Admin Web CMS',
            },
        ])

        // Seed notification channel
        await queryInterface.bulkInsert('NotificationChannel', [
            {
                id: 1,
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
                name: 'FCM',
            },
            {
                id: 2,
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                modifiedBy: JSON.stringify({ id: 'SEEDER', role: 'SEEDER', name: 'SEEDER' }),
                name: 'APNS',
            },
        ])
    },

    async down(queryInterface, _) {
        await queryInterface.dropTable('AuthSession')
        await queryInterface.dropTable('UserAuth')
        await queryInterface.dropTable('ClientAuth')
        await queryInterface.dropTable('NotificationChannel')
        await queryInterface.dropTable('ClientType')
    },
}
