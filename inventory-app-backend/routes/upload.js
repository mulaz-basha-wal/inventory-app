var express = require("express");
const multer = require("multer");
const fs = require("fs");
var router = express.Router();

const checkDirectory = () => {
  if (fs.existsSync("./uploads")) return true;
  else return false;
};
if (!checkDirectory()) fs.mkdirSync("./uploads");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fieldNameSize: 100, fileSize: 8 * 1024 * 1024 * 2 },
  fileFilter: (req, file, cb) => {
    console.log(file);
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("only .png, .jpg and .jpeg formats allowed"));
    }
  },
});

router.post("/", upload.single("file"), (req, res) => {
  res.status(200).json(req.file);
});

router.delete("/:name", (req, res) => {
  console.log("entered delete image");
  fs.unlinkSync(`./uploads/${req.params.name}`);
  res.status(200).json({ status: true });
});
module.exports = router;
