var express = require("express");
var router = express.Router();
var authenticate = require("../middlewares/authentication");
const categoryController = require("../controllers/categories");

router.post("/", authenticate, categoryController.createCategory);
router.get("/", authenticate, categoryController.readCategories);
router.put("/:id", authenticate, categoryController.updateCategory);
router.delete("/:id", authenticate, categoryController.deleteCategory);

module.exports = router;
