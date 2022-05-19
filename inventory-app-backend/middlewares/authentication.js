const jwt = require("jsonwebtoken");

const Authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(403).json({
      status: false,
      code: 403,
      message: "Token is required for auth",
    });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: "Invalid Token" });
  }
  return next();
};

module.exports = Authenticate;
