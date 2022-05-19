var express = require("express");
var router = express.Router();
var authenticate = require("../middlewares/authentication");
const inventoryController = require("../controllers/inventory");

router.post("/", authenticate, inventoryController.createItem);
router.get("/:id", authenticate, inventoryController.readInventory);
router.put("/:id", authenticate, inventoryController.updateItem);
router.delete("/:id", authenticate, inventoryController.deleteItem);

module.exports = router;
