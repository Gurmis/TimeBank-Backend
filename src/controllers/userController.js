const db = require("./dbController");
const helper = require("../helper");
const config = require("../config/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

// GET ALL
async function getMultiple(page = 1, results = 10) {
  const offset = helper.getOffset(page, results);
  const rows = await db.query(
    `SELECT *
      FROM users;`
    // FROM users LIMIT ${offset},${results}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

// GET BY ID
async function getById(id) {
  const rows = await db.query(
    `SELECT id, first_name, last_name, phone_number
     FROM users
     WHERE id = ${id};`
  );
  const data = helper.emptyOrRows(rows);

  return data;
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
  updateUser,
  deleteUser,
};
