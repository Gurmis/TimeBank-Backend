const db = require("./dbController");
const helper = require("../helper");
const config = require("../config/config");

// GET BY ID
async function getHoursByJobId(id) {
  const rows = await db.query(
    `SELECT *
       FROM hours
       WHERE job_id = ${id};`
  );
  const data = helper.emptyOrRows(rows);

  return data;
}

// POST
async function addHours(id, hours) {
  const newHours = await db.query(
    `INSERT INTO hours (job_id, user_from_id, date_finished, amount)
      VALUES
      (${id}, ${hours.userFromId}, (SELECT CURRENT_TIMESTAMP()), ${hours.amount});`
  );

  let message = "Error in adding hours";
  if (newHours.affectedRows) {
    message = `Hours for Job ID: ${id} successfully recorded`;
  }

  return { message };
}

module.exports = {
  getHoursByJobId,
  addHours,
};
