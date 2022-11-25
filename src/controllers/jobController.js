const db = require("./DbController");
const helper = require("../helper");
const config = require("../config/config");
const { response } = require("express");

const jwt = require('jsonwebtoken');


// GET ALL
async function getMultiple(req, res, next) {
  try {
    const page = req.query.page || 1;
    const results = req.query.results || 10;
    const offset = helper.getOffset(page, results);
    const rows = await db.query(
      `SELECT j.id, j.name, j.description, j.duration, AVG(r.rating) AS averageRating, l.total_likes, u.id AS userId, u.first_name, u.last_name, u.phone_number, u.password 
      FROM jobs j
      LEFT JOIN users u 
      ON j.user_id = u.id
      LEFT JOIN (SELECT l.job_id, COUNT(*) as total_likes 
             FROM likes l
             GROUP BY l.job_id) l
      ON j.id = l.job_id
      LEFT JOIN ratings r
      ON j.id = r.job_id
      GROUP BY j.id;`
      // ON j.user_id = u.id LIMIT ${offset},${results};`
    );
  
    const formattedRows = await rows.map(
      (item) =>
        (newJSON = {
          id: item.id,
          name: item.name,
          description: item.description,
          duration: item.duration,
          averageRating: item.averageRating,
          likesCount: item.total_likes,
          user: {
            id: item.userId,
            firstName: item.first_name,
            lastName: item.last_name,
            phoneNumber: item.phone_number,
            password: item.password,
          },
        })
    );
  
    const data = helper.emptyOrRows(formattedRows);
    const meta = { page };
    
    res.send({data, meta});
    
  } catch (error) {
    res.status(500).send({error})
  }
}

// GET BY ID
async function getById(req, res, next) {
  try {
    const rows = await db.query(
      `SELECT j.id, j.name, j.description, j.duration, AVG(r.rating) AS averageRating, l.total_likes, u.id AS userId, u.first_name, u.last_name, u.phone_number 
      FROM jobs j
      LEFT JOIN users u 
      ON j.user_id = u.id
      LEFT JOIN (SELECT l.job_id, COUNT(*) as total_likes 
             FROM likes l
             GROUP BY l.job_id) l
      ON j.id = l.job_id
      LEFT JOIN ratings r
      ON j.id = r.job_id
      WHERE j.id = ${req.params.id};`
    );
    const formattedRows = await rows.map(
      (item) =>
        (newJSON = {
          id: item.id,
          name: item.name,
          description: item.description,
          duration: item.duration,
          averageRating: item.averageRating,
          likesCount: item.total_likes,
          user: {
            id: item.userId,
            firstName: item.first_name,
            lastName: item.last_name,
            phoneNumber: item.phone_number
                },
        })
    );
    const data = helper.emptyOrRows(formattedRows);
    res.send(data)
    
    
  } catch (error) {
    res.status(500).send({error})
  }

}





// GET BY USER ID
async function getByUserId(req, res, next) {
  try {
    const rows = await db.query(
      `SELECT j.id, j.name, j.description, j.duration, AVG(r.rating) AS averageRating, l.total_likes, u.id AS userId, u.first_name, u.last_name, u.phone_number 
      FROM users u
      LEFT JOIN jobs j 
      ON j.user_id = u.id
      LEFT JOIN (SELECT l.job_id, COUNT(*) as total_likes 
             FROM likes l
             GROUP BY l.job_id) l
      ON j.id = l.job_id
      LEFT JOIN ratings r
      ON j.id = r.job_id
      WHERE u.id = ${req.params.id}
      GROUP BY j.id;`
    );
    const formattedRows = await rows.map(
      (item) =>
        (newJSON = {
          id: item.id,
          name: item.name,
          description: item.description,
          duration: item.duration,
          averageRating: item.averageRating,
          likesCount: item.total_likes,
          user: {
            id: item.userId,
            firstName: item.first_name,
            lastName: item.last_name,
            phoneNumber: item.phone_number,
          },
        })
    );
    const data = helper.emptyOrRows(formattedRows);
    res.send(data);
    
  } catch (error) {
    res.status(500).send({error});
  }
}

// POST
async function postNew(req, res, next) {
  try {
    const token = req.cookies.token;
    const decoded = await jwt.decode(token);
    const job = req.body;
    const newJob = await db.query(
      `INSERT INTO jobs (name, description, duration, user_id)
       VALUES ("${job.name}", "${job.description}", "${job.duration}", "${decoded.id}" )`
    );
    let message = "Error in creating user";
    if (newJob.affectedRows) {
      message = `job ${job.name.toUpperCase()} created successfully with ID: ${newJob.insertId}`;
    }
  
    res.send({message})
    
  } catch (error) {
    res.status(500).send({error});
  }
}

// PUT
async function update(req, res, next) {
  try {
    const job = req.body;
    const id = req.params.id;
    const update = await db.query(
      `UPDATE jobs
      SET name = "${job.name}", description = "${job.description}", duration = "${job.duration}"
      WHERE id = ${id};`
    );
    let message = "Error in updating job";
    if (update.affectedRows) {
      message = `job ID: ${id} updated successfully`;
    }
  
    res.send({message})
    
  } catch (error) {
    res.status(500).send({error});
  }
}

// DELETE
async function remove(req, res, next) {
  try {
    const removal = await db.query(
      `DELETE FROM jobs
      WHERE id = ${req.params.id};`
    );
  
    let message = "Error in deleting job";
    if (removal.affectedRows) {
      message = `job ID: ${req.params.id} deleted successfully`;
    }
  
    res.send({message})
    
  } catch (error) {
    res.status(500).send({error});
  }
}

// GET USER ID BY JOB ID
async function getUserIdByJobId(jobId) {
  const data = await db.query(
    `SELECT user_Id AS userId
    FROM jobs j
    WHERE j.id = ${jobId}`
  )
  return data;
}

module.exports = {
  getMultiple,
  getById,
  postNew,
  update,
  remove,
  getByUserId,
  getUserIdByJobId
};
