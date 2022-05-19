const jwt = require("jsonwebtoken");
const inventoryManagersModel = require("../models").Inventory_Managers;

const generateAccessToken = async (manager) => {
  const { id, firstName, lastName, username } = manager.dataValues;
  var accessToken = null;
  accessToken = await jwt.sign(
    { id, firstName, lastName, username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return accessToken;
};

exports.readUsers = async (req, res) => {
  await inventoryManagersModel.findAll().then(
    (users) => {
      res.json({ status: true, code: 200, users });
    },
    (error) => {
      res.json({ status: false, code: 500, error });
    }
  );
};

exports.logInInventoryManagers = (req, res) => {
  if (!(req.body.username && req.body.password)) {
    return res
      .status(400)
      .json({ status: false, message: "Username/Password not found" });
  }
  new Promise(async (resolve, reject) => {
    try {
      let manager = await inventoryManagersModel.findOne({
        where: { username: req.body.username, password: req.body.password },
      });
      if (manager === null)
        reject({ status: false, code: 400, message: "Invalid Credentials" });
      else {
        const accessToken = await generateAccessToken(manager);
        const { id, firstName, lastName, username, email } = manager.dataValues;
        if (!accessToken) {
          reject({
            status: false,
            code: 500,
            message: "Internal server error occured",
          });
        } else {
          resolve({
            status: true,
            message: "User Logged in Successfully",
            user: { id, firstName, lastName, username, accessToken, email },
          });
        }
      }
    } catch (error) {
      reject({
        status: false,
        code: 500,
        message: "Internal server error occured",
        error,
      });
    }
  })
    .then((message) => {
      res.status(200).json(message);
    })
    .catch((error) => {
      res.status(error.code).json(error);
    });
};

exports.changePassword = async (req, res) => {
  await inventoryManagersModel
    .findOne({
      where: {
        id: req.params.id,
        username: req.body.username,
        password: req.body.oldpassword,
      },
    })
    .then((record) => {
      if (!record) {
        return res
          .status(404)
          .json({ status: false, code: 404, message: "Record not found" });
      } else {
        try {
          inventoryManagersModel
            .update(
              { password: req.body.newpassword },
              { where: { id: req.params.id } }
            )
            .then(() => {
              res.status(200).json({
                status: true,
                code: 200,
                message: "Password updated successfully",
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
