var express = require("express");
var router = express.Router();
var authenticate = require("../middlewares/authentication");

// iManager = inventory managers
var iManager = require("../controllers/inventory_managers");

router.get("/", authenticate, iManager.readUsers);
router.post("/auth", iManager.logInInventoryManagers);
router.post("/changepassword/:id", authenticate, iManager.changePassword);
router.get("/checkToken", authenticate, (req, res) => {
  res.status(200).json({ status: true, code: 200 });
});

module.exports = router;
