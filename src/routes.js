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

router.get('/test', authorizationController.validateLogin )
// REGISTER USER
router.post("/users", userController.registerUser);

// LOGIN
router.get("/login", authenticationController.login);

// LOGOUT
router.get("/logout", authenticationController.logout);

// PUT
router.put("/users/:id", userController.updateUser);

// DELETE
router.delete("/users/:id", async (req, res, next) => {
  try {
    res.json(await userController.remove(req.params.id));
  } catch (err) {
    console.log("Error while deleting user", err);
    next(err);
  }
});



//*****JOBS**********************************************************************//

// GET ALL
router.get("/jobs", async (req, res, next) => {
  try {
    res.json(
      await jobController.getMultiple(
        req.query.page,
        req.query.results
      )
    );
  } catch (err) {
    console.log("Error while getting jobs", err);
    next(err);
  }
});

// GET BY ID
router.get("/jobs/:id", async (req, res, next) => {
  try {
    res.json(await jobController.getById(req.params.id));
  } catch (err) {
    console.log(`Error while getting job with ID: ${req.params.id}`, err);
    next(err);
  }
});

// GET BY ID
router.get("/users/:id/jobs", async (req, res, next) => {
  try {
    res.json(await jobController.getByUserId(req.params.id));
  } catch (err) {
    console.log(`Error while getting jobs of user with ID: ${req.params.id}`, err);
    next(err);
  }
});

// POST
router.post("/jobs", async (req, res, next) => {
  try {
    res.json(await jobController.postNew(req.body));
  } catch (err) {
    console.log("Error while posting job", err);
    next(err);
  }
});

// PUT
router.put("/jobs/:id", async (req, res, next) => {
  try {
    res.json(await jobController.update(req.params.id, req.body));
  } catch (err) {
    console.log("Error while updating job", err);
    next(err);
  }
});

// DELETE
router.delete("/jobs/:id", async (req, res, next) => {
  try {
    res.json(await jobController.remove(req.params.id));
  } catch (err) {
    console.log("Error while deleting job", err);
    next(err);
  }
});



//*****HOURS***************************************************************//
// GET HOURS BY JOB ID
router.get("/jobs/:id/hours", async (req, res, next) => {
  try {
    res.json(await hoursController.getHoursByJobId(req.params.id));
  } catch (err) {
    console.log(`Error while getting hours of job with ID: ${req.params.id}`, err);
    next(err);
  }
});

// GET HOURS BY USER ID
router.get("/users/:id/hours", async (req, res, next) => {
  try {
    res.json(await hoursController.getHoursByUserId(req.params.id));
  } catch (err) {
    console.log(`Error while getting hours of user with ID: ${req.params.id}`, err);
    next(err);
  }
});

//POST HOURS
router.post("/jobs/:id/hours", async (req, res, next) => {
  try {
    res.json(await hoursController.addHours(req.params.id, req.body));
  } catch (err) {
    console.log(`Error while adding hours of job with ID: ${req.params.id}`, err);
    next(err);
  }
});


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
