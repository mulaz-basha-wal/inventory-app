"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Inventory_Managers",
      [
        {
          firstname: "Mulaz",
          lastname: "Basha",
          username: "mulazbasha",
          email: "mulaz@gmail.com",
          password: "mulazbasha",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Anthony",
          lastname: "Stark",
          username: "anthonystark",
          email: "anthonystark@gmail.com",
          password: "anthonystark",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
