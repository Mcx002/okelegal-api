'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Admin', {
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
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            statusId: {
                type: Sequelize.SMALLINT,
                allowNull: false,
                references: {
                    model: 'ControlStatus',
                    key: 'id',
                },
            },
        })
        await queryInterface.createTable('AdminAuth', {
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
            adminId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Admin',
                    key: 'id',
                },
            },
            adminXid: {
                type: Sequelize.STRING(6),
                allowNull: false,
            },
            clientId: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            clientSecret: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
        })
    },

    async down(queryInterface, _) {
        await queryInterface.dropTable('AdminAuth')
        await queryInterface.dropTable('Admin')
    },
}
