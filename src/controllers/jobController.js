const db = require("./DbController");
const helper = require("../helper");
const config = require("../config/config");
const cookieParser = require('cookie-parser');
// GET ALL
async function getMultiple(page = 1, results = 10) {
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
  

  return {
    data,
    meta,
  };
}

// GET BY ID
async function getById(id) {
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
    WHERE j.id = ${id};`
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
  return data;

}
// GET BY USER ID
async function getByUserId(id) {
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
    WHERE u.id = ${id}
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
  return formattedRows;
}

// POST
async function postNew(job) {
  const newJob = await db.query(
    `INSERT INTO jobs (name, description, duration, user_id)
     VALUES ("${job.name}", "${job.description}", "${job.duration}", "${job.userId}" )`
  );
  let message = "Error in creating user";
  if (newJob.affectedRows) {
    message = `job ${job.name.toUpperCase()} created successfully with ID: ${newJob.insertId}`;
  }

  return { message };
}

// PUT
async function update(id, job) {
  const update = await db.query(
    `UPDATE jobs
    SET name = "${job.name}", description = "${job.description}", duration = "${job.duration}"
    WHERE id = ${id};`
  );

  let message = "Error in updating job";
  if (update.affectedRows) {
    message = `job ID: ${id} updated successfully`;
  }

  return { message };
}

// DELETE
async function remove(id) {
  const removal = await db.query(
    `DELETE FROM jobs
    WHERE id = ${id};`
  );

  let message = "Error in deleting job";
  if (removal.affectedRows) {
    message = `job ID: ${id} deleted successfully`;
  }

  return { message };
}

module.exports = {
  getMultiple,
  getById,
  postNew,
  update,
  remove,
  getByUserId
};
