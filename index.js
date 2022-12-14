require("dotenv").config();
const https = require('https');
const fs = require('fs');
// const { application } = require("express");
const express = require("express");
const config = require("./src/config/config");
const app = express();
const db = require("./src/controllers/dbController");
const routes = require("./src/routes");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const port = config.app_port;
const allowedOrigins = [
  "http://localhost:4200",
  "http://127.0.0.1:4200",
  "https://timebank-fe.web.app",
  "https://curious-youtiao-afd610.netlify.app"
];

// const options = {
//   key: fs.readFileSync('src/cert/key.pem'),
//   cert: fs.readFileSync('src/cert/cert.pem')
// };


app.use(cors({
  credentials: true,
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/", routes);

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

// const appS = https.createServer(options, app);
// appS.listen(port, () => {
//   console.log(`Server is running at port: ${config.app_port}`);
// });

app.listen(port, () => {
  console.log(`Server is running at port: ${config.app_port}`);
});
