const jwt_decode = require("jwt-decode");

module.exports = {
  async validateLogin(req, res, next) {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt_decode(token);
      if (decoded.role == "admin") {
        next();
      } else {
        res.status(403).send({ message: "Insufficient rights!" });
      }
    }
    if (!token) {
      res.status(403).send({ message: "User not logged in!" });
    }
  },
};
