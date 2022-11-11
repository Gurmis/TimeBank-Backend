require('dotenv').config();
const { application } = require('express');
const express = require('express');
const config = require('./src/config/config');
const app = express();
const db = require('./src/controllers/dbController');
const routes = require('./src/routes');

// app.use(
//     express.json({
//         type: ["application/json", "text/plain"]
//     })
// );

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use('/', routes);

// Error handler middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
  });

app.listen(config.app_port, () => {
    console.log(`Server is running at port: ${config.app_port}`)
});



