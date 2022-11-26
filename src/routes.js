const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const jobController = require("./controllers/JobController");
const hoursController = require("./controllers/hoursController");
const likesController = require("./controllers/likesController");
const ratingsController = require("./controllers/ratingsController");
const authenticationController = require("./controllers/AuthenticationController");
const authorizationController = require("./controllers/AuthorizationController");
const AuthorizationController = require("./controllers/AuthorizationController");



// REGISTER USER
router.post("/users", userController.registerUser);

// LOGIN
router.post("/login", authenticationController.login);

// LOGOUT
router.get("/logout", authenticationController.logout);



//*****USERS***************************************************************//

// GET ALL
router.get("/users", authorizationController.validateJwtToken, userController.getMultiple)

// GET BY ID
router.get("/users/:id",  authorizationController.validateJwtToken, userController.getById);



// PUT 
router.put("/users/:id",  authorizationController.validateJwtToken, userController.updateUser);

// DELETE
router.delete("/users/:id", authorizationController.validateUserRole, userController.deleteUser);



//*****JOBS**********************************************************************//

// GET ALL
router.get("/jobs",  authorizationController.validateJwtToken, jobController.getMultiple);

// GET BY ID
router.get("/jobs/:id",  authorizationController.validateJwtToken, jobController.getById);

// GET BY ID
router.get("/users/:id/jobs",  authorizationController.validateJwtToken, jobController.getByUserId);

// POST
router.post("/jobs",  authorizationController.validateJwtToken, jobController.postNew);

// PUT
router.put("/jobs/:id",  authorizationController.validateJwtToken, jobController.update);

// DELETE
router.delete("/jobs/:id", authorizationController.validateAccessByJob, jobController.remove);



//*****HOURS***************************************************************//

// GET HOURS BY JOB ID
router.get("/jobs/:id/hours", authorizationController.validateAccessByJob, hoursController.getHoursByJobId);

// GET HOURS BY USER ID
router.get("/users/:id/hours", authorizationController.validateAccessByUser, hoursController.getHoursByUserId);

//POST HOURS
router.post("/jobs/:id/hours",  authorizationController.validateJwtToken, hoursController.addHours);





//*****LIKES***************************************************************//

// GET LIKES BY JOB ID
router.get("/jobs/:id/likes",  authorizationController.validateJwtToken, likesController.getLikesByJobId);

//POST HOURS
router.post("/jobs/:id/likes",  authorizationController.validateJwtToken, likesController.addLike);



//*****RATINGS***************************************************************//

// GET RATINGS BY JOB ID
router.get("/jobs/:id/ratings",  authorizationController.validateJwtToken, ratingsController.getRatingsByJobId);

//POST RATINGS
router.post("/jobs/:id/ratings",  authorizationController.validateJwtToken, ratingsController.addRating);



module.exports = router;
