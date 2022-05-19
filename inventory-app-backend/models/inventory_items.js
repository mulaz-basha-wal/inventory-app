"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Inventory_Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Inventory_Items.belongsTo(models.Inventory_Managers, {
        foreignKey: "user_id",
        as: "user",
      });
      Inventory_Items.belongsTo(models.Categories, {
        foreignKey: "category_id",
        as: "category",
      });
    }
  }
  Inventory_Items.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      quantity: DataTypes.NUMBER,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Inventory_Items",
    }
  );
  return Inventory_Items;
};
