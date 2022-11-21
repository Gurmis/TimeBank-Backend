const db = require("./dbController");
const helper = require("../helper");
const config = require("../config/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const expirationOneHour = 60 * 60;

// REGISTER USER
async function registerUser(user) {
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);
  const newUser = await db.query(
    `INSERT INTO users (first_name, last_name, phone_number, password)
       VALUES ("${user.firstName}", "${user.lastName}", "${user.phoneNumber}", "${hashedPassword}" )`
  );
  let message = "Error in creating user";
  if (newUser.affectedRows) {
    message = `user ${user.firstName} ${user.lastName} created successfully with ID: ${newUser.insertId}`;
  }

  return { message };
}

// LOGIN
async function login(user) {
  const rows = await db.query(
    `SELECT id, first_name AS firstName, last_name AS lastName, phone_number AS phoneNumber, password
       FROM users
       WHERE phone_number LIKE "${user.phoneNumber}";`
  );

  let { id, firstName, lastName, phoneNumber, password } = rows[0];

  const passwordMatch = await bcrypt.compare(user.password, password);
  password = "";

  const message = "Login credentials are invalid!";

  if (!passwordMatch) {
    return { message };
  }
  
  const data = { id, firstName, lastName, phoneNumber };
  const token = await jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: expirationOneHour,
  });

  return token;
}

module.exports = {
  registerUser,
  login,
};
