const db = require("./DbController");
const { response } = require("express");
const helper = require("../helper");
const config = require("../config/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

// GET ALL
async function getMultiple(req, res, next) {
  try {
    const page = req.query.page || 1;
    const results = req.query.results || 10;
    const offset = helper.getOffset(page, results);
    const rows = await db.query(
      `SELECT id, first_name, last_name, phone_number, role
      FROM users;`
      // FROM users LIMIT ${offset},${results}`
    );
    const data = helper.emptyOrRows(rows);
    const meta = { page };

    res.send({
      data,
      meta,
    });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Something went wrong, please try again later.",
      });
    console.log(error);
  }
}

// GET BY ID
async function getById(id) {
  const rows = await db.query(
    `SELECT id, first_name, last_name, phone_number, role
     FROM users
     WHERE id = ${id};`
  );
  const data = helper.emptyOrRows(rows);

  return data;
}

// REGISTER USER
async function registerUser(req, res) {
  try {
    const duplicate = await db.query(
      `SELECT id, first_name, last_name, phone_number, role
       FROM users
       WHERE phone_number LIKE "${req.body.phoneNumber}";`
    );

    if (!duplicate.length == 0) {
      return res.status(401).send({
        message: "Phone number already exists in the database!",
      });
    }

    const hashedPassword = await bcrypt.hash(
      req.body.password,
      saltRounds
    );
    const newUser = await db.query(
      `INSERT INTO users (first_name, last_name, phone_number, password, role)
         VALUES ("${req.body.firstName}", "${req.body.lastName}", "${req.body.phoneNumber}", "${hashedPassword}", "user" )`
    );
    const message = `user ${req.body.firstName} ${req.body.lastName} created successfully`;
    res.status(200).send({ message });
  } catch (error) {
    res.status(500).send({ error });
  }
}

// PUT
async function updateUser(id, user) {
  const update = await db.query(
    `UPDATE users
    SET first_name = "${user.firstName}", last_name = "${user.lastName}", phone_number = "${user.phoneNumber}"
    WHERE id = ${id};`
  );

  let message = "Error in updating user";
  if (update.affectedRows) {
    message = `user ID: ${id} updated successfully`;
  }

  return { message };
}

// DELETE
async function deleteUser(id) {
  const removal = await db.query(
    `DELETE FROM users
    WHERE id = ${id};`
  );

  let message = "Error in deleting user";
  if (removal.affectedRows) {
    message = `user ID: ${id} deleted successfully`;
  }

  return { message };
}

module.exports = {
  getMultiple,
  getById,
  registerUser,
  updateUser,
  deleteUser,
};
