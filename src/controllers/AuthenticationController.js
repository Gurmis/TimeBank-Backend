const db = require("./dbController");
const { response } = require("express");
const helper = require("../helper");
const config = require("../config/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const expirationOneHour = 60 * 60;

// LOGIN
async function login(req, res) {
  try {
    const { phoneNumber, password } = req.body;
    const user = await db.query(
      `SELECT id, first_name AS firstName, last_name AS lastName, phone_number AS phoneNumber, password, role
       FROM users
       WHERE phone_number LIKE "${req.body.phoneNumber}";`
    );
    if (user.length == 0) {
      return res.status(401).send({
        error: "Login credentials are invalid",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user[0].password
    );
    delete user[0].password;

    if (!passwordMatch) {
      return res.status(401).send({
        error: "Login credentials are invalid",
      });
    } else {
      const token = await jwt.sign(user[0], process.env.JWT_SECRET, {
        expiresIn: expirationOneHour,
      });
      res.cookie("token", token, {
        maxAge: 1000 * 60 * 60,
        httpOnly: false,
        withCredentials: true,
      });

      return res.send(token);
    }
  } catch (error) {
    res.status(500).send({
      error: "Server error. Please try again later.",
    });
    console.log(error);
  }
}

async function logout(req, res) {
  // res.clearCookie("token");
  res.cookie("token", "sevas", {
    maxAge: 1000 * 60 * 60,
    httpOnly: false,
    secure: true,
    withCredentials: true,
    sameSite: "none",
  });
  res.status(200).send({ message: "User successfully logged out" });
}

module.exports = {
  login,
  logout,
};
