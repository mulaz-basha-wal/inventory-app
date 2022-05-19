const fs = require("fs");
const { body, validationResult } = require("express-validator");
var inventoryItems = require("../models").Inventory_Items;
const nodeCron = require("node-cron");

// secheduled job at 7:00AM evvery day
nodeCron.schedule("0 0 7 * * *", async () => {
  // incrementing inventory items by 100 every day at 7AM
  await inventoryItems.increment("quantity", { by: 100 });
});

exports.readInventory = async (req, res) => {
  await inventoryItems.findAll({ where: { user_id: req.params.id } }).then(
    (inventory_items) => {
      res.json({ status: true, code: 200, inventory_items });
    },
    (error) => {
      res.json({ status: false, code: 500, error });
    }
  );
};

exports.createItem = [
  body("name")
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage("Min 5 and Max length to be 20"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage("Min 10 and Max length to be 100"),
  body("quantity")
    .isLength({ min: 10 })
    .withMessage("Quantity should be at least 10 units"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ status: false, errors });
    } else {
      let { name, description, quantity, category_id, user_id, image } =
        req.body;
      category_id = parseInt(category_id, 10);
      user_id = parseInt(user_id, 10);
      await inventoryItems
        .create({ name, description, quantity, category_id, user_id, image })
        .then(
          (product) => {
            res.status(200).json({ status: true, code: 200, product });
          },
          (error) => {
            res.status(500).json({ status: false, code: 500, error });
          }
        );
    }
  },
];

exports.updateItem = async (req, res) => {
  let payLoad = [];
  Reflect.ownKeys(req.body).forEach((key) => {
    payLoad = JSON.parse(key);
  });
  const { name, description, quantity, category_id } = payLoad;
  await inventoryItems
    .update(
      { name, description, quantity, category_id },
      { where: { id: req.params.id } }
    )
    .then((result) => {
      res.status(200).json({
        status: true,
        code: 200,
        message: "updated successfully",
        result,
      });
    });
};

exports.deleteItem = async (req, res) => {
  await inventoryItems
    .findOne({ where: { id: req.params.id } })
    .then((record) => {
      if (!record) {
        return res
          .status(404)
          .json({ status: false, code: 404, message: "Record not found" });
      } else {
        try {
          inventoryItems.destroy({ where: { id: req.params.id } }).then(() => {
            res.status(200).json({
              status: true,
              code: 200,
              message: "Deleted successfully",
            });
          });
          fs.unlinkSync(`./uploads/${record.dataValues.image}`);
        } catch {
          res.json({
            status: false,
            code: 500,
            message: "Internal Server Error",
          });
        }
      }
    });
};
