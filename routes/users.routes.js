const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");



const {  getUserHours, saveServiceContract, getServicesContract, getServiceRequests, acceptServiceContract} = require('../controllers/users.controllers')

// router.put("/update-hours/:owner", isAuthenticated, updateHours)

// Rutas dependientes del usuario
router.get('/users/:user_id/services-contracted', isAuthenticated, getServicesContract);
router.get('/users/:user_id/get-services-requests', isAuthenticated, getServiceRequests);
router.get('/users/:user_id/get-available-hours', isAuthenticated, getUserHours);
router.post('/users/:user_id/contract-service', isAuthenticated, saveServiceContract);

// Rutas generales
router.post('/services/accept', isAuthenticated, acceptServiceContract);


module.exports = router

