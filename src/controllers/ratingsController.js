const db = require("./dbController");
const helper = require("../helper");
const config = require("../config/config");

// GET BY ID
async function getRatingsByJobId(req, res, next) {
  try {
    const id = req.params.id;
    const rows = await db.query(
      `SELECT *
         FROM ratings
         WHERE job_id = ${id};`
    );
    const data = helper.emptyOrRows(rows);
  
    res.send(data);
    
  } catch (error) {
    res.status(500).send({error})
  }
} 

// POST
async function addRating(req, res, next) {
  try {
    const id = req.params.id;
    const rating = req.body;
    const newRating = await db.query(
      `INSERT INTO ratings (job_id, rating, date_added)
        VALUES
        (${id}, ${rating.rating}, (SELECT CURRENT_TIMESTAMP()));`
    );
  
    let message = "Error in recording rating";
    if (newRating.affectedRows) {
      message = `Rating for Job ID: ${id} successfully recorded`;
    }
  
    res.send({message});
    
  } catch (error) {
    res.status(500).send({error})
  }
}


module.exports = {
  getRatingsByJobId,
  addRating,
};
