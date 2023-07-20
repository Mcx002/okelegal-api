'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Invoice', {
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
            submissionId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Submission',
                    key: 'id',
                },
            },
            submissionXid: {
                type: Sequelize.STRING(6),
                allowNull: false,
            },
            paymentReceipt: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
        })
    },

    async down(queryInterface, _) {
        await queryInterface.dropTable('Invoice')
    },
}
