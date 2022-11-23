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
        error,
      });

  }
}

// GET BY ID
async function getById(req, res, next) {
  try {
    const rows = await db.query(
      `SELECT id, first_name, last_name, phone_number, role
       FROM users
       WHERE id = ${req.params.id};`
    );
    const data = helper.emptyOrRows(rows);
  
    return res.send(data);
    
  } catch (error) {
    res
      .status(500)
      .send({
        error,
      });
  }
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
async function updateUser(req, res, next) {
  try {
    const update = await db.query(
      `UPDATE users
      SET first_name = "${req.body.firstName}", last_name = "${req.body.lastName}", phone_number = "${req.body.phoneNumber}"
      WHERE id = ${req.params.id};`
    );
  
    let message = "Error in updating user";
    if (update.affectedRows) {
      message = `user ID: ${req.params.id} updated successfully`;
    }
  
    res.status(200).send({ message });
    
  } catch (error) {
    res.status(500).send({ error });
  }
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
