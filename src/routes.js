const express = require("express");
const router = express.Router();
const userController = require("./controllers/UserController");
const jobController = require("./controllers/JobController");
const hoursController = require("./controllers/HoursController");
const likesController = require("./controllers/LikesController");
const ratingsController = require("./controllers/RatingsController");
const authenticationController = require("./controllers/AuthenticationController");
const authorizationController = require("./controllers/AuthorizationController");



//*****USERS***************************************************************//

// GET ALL
router.get("/users", userController.getMultiple)

// GET BY ID
router.get("/users/:id", userController.getById);

router.get('/test', authorizationController.validateLogin );

// REGISTER USER
router.post("/users", userController.registerUser);

// LOGIN
router.get("/login", authenticationController.login);

// LOGOUT
router.get("/logout", authenticationController.logout);

// PUT
router.put("/users/:id", userController.updateUser);

// DELETE
router.delete("/users/:id", authorizationController.validateLogin, userController.deleteUser);



//*****JOBS**********************************************************************//

// GET ALL
router.get("/jobs", jobController.getMultiple);

// GET BY ID
router.get("/jobs/:id", jobController.getById);

// GET BY ID
router.get("/users/:id/jobs", jobController.getByUserId);

// POST
router.post("/jobs", jobController.postNew);

// PUT
router.put("/jobs/:id", jobController.update);

// DELETE
router.delete("/jobs/:id", jobController.remove);



//*****HOURS***************************************************************//

// GET HOURS BY JOB ID
router.get("/jobs/:id/hours", hoursController.getHoursByJobId);

// GET HOURS BY USER ID
router.get("/users/:id/hours", hoursController.getHoursByUserId);

//POST HOURS
router.post("/jobs/:id/hours", hoursController.addHours);





//*****LIKES***************************************************************//

// GET LIKES BY JOB ID
router.get("/jobs/:id/likes", likesController.getLikesByJobId);

//POST HOURS
router.post("/jobs/:id/likes", likesController.addLike);



//*****RATINGS***************************************************************//

// GET RATINGS BY JOB ID
router.get("/jobs/:id/ratings", ratingsController.getRatingsByJobId);

//POST RATINGS
router.post("/jobs/:id/ratings", ratingsController.addRating);



module.exports = router;
