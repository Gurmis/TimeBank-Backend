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
router.delete("/users/:id", userController.deleteUser);



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
router.get("/jobs/:id/likes", async (req, res, next) => {
  try {
    res.json(await likesController.getLikesByJobId(req.params.id));
  } catch (err) {
    console.log(`Error while getting likes of job with ID: ${req.params.id}`, err);
    next(err);
  }
});

//POST HOURS
router.post("/jobs/:id/likes", async (req, res, next) => {
  try {
    res.json(await likesController.addLike(req.params.id));
  } catch (err) {
    console.log(`Error while adding hours of job with ID: ${req.params.id}`, err);
    next(err);
  }
});

//*****RATINGS***************************************************************//
// GET RATINGS BY JOB ID
router.get("/jobs/:id/ratings", async (req, res, next) => {
  try {
    res.json(await ratingsController.getRatingsByJobId(req.params.id));
  } catch (err) {
    console.log(`Error while getting ratings of job with ID: ${req.params.id}`, err);
    next(err);
  }
});

//POST RATINGS
router.post("/jobs/:id/ratings", async (req, res, next) => {
  try {
    res.json(await ratingsController.addRating(req.params.id, req.body));
  } catch (err) {
    console.log(`Error while adding reting of job with ID: ${req.params.id}`, err);
    next(err);
  }
});







module.exports = router;
