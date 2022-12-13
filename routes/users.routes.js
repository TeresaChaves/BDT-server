const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");


const Service = require('./../models/Service.model')
const User = require('./../models/User.model')

const { updateHours, getUserHours } = require('../controllers/users.controllers')

router.put("/update-hours/:owner", isAuthenticated, updateHours)

router.get("/get-available-hours/:user_id", isAuthenticated, getUserHours)


module.exports = router