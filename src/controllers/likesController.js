const db = require("./DbController");
const helper = require("../helper");
const config = require("../config/config");

// GET BY ID
async function getLikesByJobId(id) {
  const rows = await db.query(
    `SELECT COUNT(job_id) AS likes
       FROM likes
       WHERE job_id = ${id};`
  );
  const data = helper.emptyOrRows(rows);

  return data;
}

// POST
async function addLike(id) {
  const newLike = await db.query(
    `INSERT INTO likes (job_id, date_added)
      VALUES
      (${id}, (SELECT CURRENT_TIMESTAMP()));`
  );

  let message = "Error in adding like";
  if (newLike.affectedRows) {
    message = `Like for Job ID: ${id} successfully added`;
  }

  return { message };
}

module.exports = {
    getLikesByJobId,
    addLike
}