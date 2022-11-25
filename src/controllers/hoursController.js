const db = require("./DbController");
const helper = require("../helper");
const config = require("../config/config");
const jwt = require('jsonwebtoken');

// GET BY JOB ID
async function getHoursByJobId(req, res, next) {
  try {
    const id = req.params.id;
    const rows = await db.query(
      `SELECT *
         FROM hours
         WHERE job_id = ${id};`
    );
    const data = helper.emptyOrRows(rows);
  
    res.send(data);
    
  } catch (error) {
    res.status(500).send({error})
  }
}

// GET BY USER ID
async function getHoursByUserId(req, res, next) {
  try {
    const id = req.params.id;
    const rows = await db.query(
      `SELECT jo.name, h.amount, h.date_finished, u2.first_name AS first_name_for, u2.last_name AS last_name_for
      FROM hours h
      LEFT JOIN (SELECT j.id AS jid, j.name, u.id AS user_id
          FROM jobs j
          JOIN users u 
          ON j.user_id  = u.id ) jo
      ON h.job_id = jo.jid
      LEFT JOIN users u2
      ON h.user_from_id = u2.id 
      WHERE jo.user_id  = ${id};`
    );
    const data = helper.emptyOrRows(rows);
    res.send(data);
    
  } catch (error) {
    res.status(500).send({error})
  }
}

// POST
async function addHours(req, res, next) {
  try {
    const token = req.cookies.token;
    const decoded = await jwt.decode(token);
    const id = req.params.id;
    const hours = req.body;
    const newHours = await db.query(
      `INSERT INTO hours (job_id, user_from_id, date_finished, amount)
        VALUES
        (${id}, ${decoded.id}, (SELECT CURRENT_TIMESTAMP()), ${hours.amount});`
    );
  
    let message = "Error in adding hours";
    if (newHours.affectedRows) {
      message = `Hours for Job ID: ${id} successfully recorded`;
    }
  
    res.send({message});
    
  } catch (error) {
    res.status(500).send({error})
  }
  
}

module.exports = {
  getHoursByJobId,
  addHours,
  getHoursByUserId
};
