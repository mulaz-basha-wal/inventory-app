const categoryModel = require("../models").Categories;

exports.createCategory = async (req, res) => {
  await categoryModel.create(req.body).then(
    (category) => {
      res.status(200).json({ status: true, code: 200, category });
    },
    (error) => {
      res.status(500).json({ status: false, code: 500, error });
    }
  );
};

exports.readCategories = async (req, res) => {
  await categoryModel.findAll().then(
    (categories) => {
      res.json({ status: true, code: 200, categories });
    },
    (error) => {
      res.json({ status: false, code: 500, error });
    }
  );
};

exports.updateCategory = async (req, res) => {
  await categoryModel
    .findOne({ where: { id: req.params.id } })
    .then((record) => {
      if (!record) {
        return res
          .status(404)
          .json({ status: false, code: 404, message: "Record not found" });
      } else {
        try {
          categoryModel
            .update(req.body, { where: { id: req.params.id } })
            .then(() => {
              res.status(200).json({
                status: true,
                code: 200,
                message: "updated successfully",
              });
            });
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

exports.deleteCategory = async (req, res) => {
  await categoryModel
    .findOne({ where: { id: req.params.id } })
    .then((record) => {
      if (!record) {
        return res
          .status(404)
          .json({ status: false, code: 404, message: "Record not found" });
      } else {
        try {
          categoryModel.destroy({ where: { id: req.params.id } }).then(() => {
            res.status(200).json({
              status: true,
              code: 200,
              message: "deleted successfully",
            });
          });
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
