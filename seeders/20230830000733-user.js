'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', [{
      firstName: 'John',
      lastName: 'Warhammer',
      userName: 'Salamdeer',
      email: 'ilovemarines@warhammer.com',
      password: "$2b$10$aTFSnR7oF2OXK9es7kGW0.vAEHtRnzBNcWGKFEewvTO2e753f/GEy",
      location: 'Atlanta',
      favfaction: 'Space Marines',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {})
  }
};
