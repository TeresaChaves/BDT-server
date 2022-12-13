const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");


const Service = require('./../models/Service.model')
const User = require('./../models/User.model')

const { updateUser, getUserHours } = require('../controllers/users.controllers')

router.put("/update-user/:owner", isAuthenticated, updateUser)

router.get("/get-available-hours/:user_id", isAuthenticated, getUserHours)


module.exports = router