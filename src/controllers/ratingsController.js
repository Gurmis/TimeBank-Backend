const db = require("./DbController");
const helper = require("../helper");
const config = require("../config/config");

// GET BY ID
async function getRatingsByJobId(id) {
  const rows = await db.query(
    `SELECT *
       FROM ratings
       WHERE job_id = ${id};`
  );
  const data = helper.emptyOrRows(rows);

  return data;
}

// POST
async function addRating(id, rating) {
  const newRating = await db.query(
    `INSERT INTO ratings (job_id, rating, date_added)
      VALUES
      (${id}, ${rating.rating}, (SELECT CURRENT_TIMESTAMP()));`
  );

  let message = "Error in recording rating";
  if (newRating.affectedRows) {
    message = `Rating for Job ID: ${id} successfully recorded`;
  }

  return { message };
}


module.exports = {
  getRatingsByJobId,
  addRating,
};
