'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkUpdate('SubmissionStatus', { name: 'Payment Invalid' }, { id: 3 })
        await queryInterface.bulkUpdate('SubmissionStatus', { name: 'Invalid Data' }, { id: 5 })

        await queryInterface.addColumn('Submission', 'notes', {
            type: Sequelize.TEXT,
            allowNull: true,
        })
    },

    async down(queryInterface, _) {
        await queryInterface.bulkUpdate('SubmissionStatus', { name: 'Valid' }, { id: 3 })
        await queryInterface.bulkUpdate('SubmissionStatus', { name: 'Need Revision' }, { id: 5 })

        await queryInterface.removeColumn('Submission', 'notes')
    },
}
