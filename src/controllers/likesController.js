const db = require("./dbController");
const helper = require("../helper");
const config = require("../config/config");

// GET BY ID
async function getLikesByJobId(req, res, next) {
  try {
    const id = req.params.id;
    const rows = await db.query(
      `SELECT COUNT(job_id) AS likes
         FROM likes
         WHERE job_id = ${id};`
    );
    const data = helper.emptyOrRows(rows);
  
    res.send(data);
    
  } catch (error) {
    res.status(500).send({error});
  }
}

// POST
async function addLike(req, res, next) {
  try {
    const id = req.params.id;
    const newLike = await db.query(
      `INSERT INTO likes (job_id, date_added)
        VALUES
        (${id}, (SELECT CURRENT_TIMESTAMP()));`
    );
  
    let message = "Error in adding like";
    if (newLike.affectedRows) {
      message = `Like for Job ID: ${id} successfully added`;
    }
  
    res.send({message});
    
  } catch (error) {
    res.status(500).send({error})
  }
}

module.exports = {
    getLikesByJobId,
    addLike
}