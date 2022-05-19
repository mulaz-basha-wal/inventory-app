"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Inventory_Managers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Inventory_Managers.hasMany(models.Inventory_Items, {
        foreignKey: { type: DataTypes.INTEGER, name: "user_id" },
      });
    }
  }
  Inventory_Managers.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Inventory_Managers",
    }
  );
  return Inventory_Managers;
};
