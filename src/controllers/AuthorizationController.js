const jwt = require("jsonwebtoken");
const jobController = require('./JobController');

module.exports = {
  async validateUserRole(req, res, next) {
    const token = req.cookies.token;

    if (token) {
      try {
        const verified = await jwt.verify(
          token,
          process.env.JWT_SECRET
        );
        if (verified.role == "admin") {
          next();
        } else {
          res.status(403).send({ message: "Access denied!" });
        }
      }
       catch (error) {
        res.status(500).send({message: "Something went wrong, please try again later"})
      console.log(error);
    }
  }
    if (!token) {
      res.status(403).send({ message: "User not logged in!" });
    }
  },

  async validateAccessByUser(req, res, next) {
    const token = req.cookies.token;

    if (token) {
      try {
        const verified = await jwt.verify(
          token,
          process.env.JWT_SECRET
        );
        if (verified.role == "admin") {
          next();
        } else if (verified.id == req.params.id) {
          next();
        } else {
          res.status(403).send({ message: "Access denied!" });
        }
      }
       catch (error) {
        res.status(500).send({message: "Something went wrong, please try again later"})
      console.log(error);
    }
  }
    if (!token) {
      res.status(403).send({ message: "User not logged in!" });
    }
  },

  async validateAccessByJob(req, res, next) {
    const token = req.cookies.token;

    if (token) {
      try {
        const verified = await jwt.verify(
          token,
          process.env.JWT_SECRET
        );
        const userId = await jobController.getUserIdByJobId(req.params.id);
        
        if (verified.role == "admin") {
          next();
        }

        else if (
          userId[0].userId == verified.id
          ) {
          next();
        } else {
          res.status(403).send({ message: "Access denied!" });
        }
      }
       catch (error) {
        res.status(500).send({message: "Something went wrong, please try again later"})
      console.log(error);
    }
  }
    if (!token) {
      res.status(403).send({ message: "User not logged in!" });
    }
  },

  async validateJwtToken(req, res, next) {
    const token = req.cookies.token;

    if (token) {
      try {
        const verified = await jwt.verify(
          token,
          process.env.JWT_SECRET);
          if (verified) {
            next();
          }
      }
       catch (error) {
        res.status(500).send({message: "Something went wrong, please try again later"})
      console.log(error);
    }
  }
    if (!token) {
      res.status(403).send({ message: "User not logged in!" });
    }
  }
}
