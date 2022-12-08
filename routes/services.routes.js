const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Service = require('./../models/Service.model')


router.get("/allServices", (req, res) => {

    Service
        .find()
        .select({ name: 1, image: 1, owner: 1 })
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})


router.get("/serviceDetails/:service_id", (req, res, next) => {

    const { service_id } = req.params

    Service
        .findById(service_id)
        .then(response => res.json(response))
        .catch(err => next(err))
})


router.post("/addService", isAuthenticated, (req, res, next) => {
    const { name, description, image, totalhours, date, status } = req.body
    Service
        .create({ name, description, image, totalhours, date, status, owner: req.payload._id })
        .then(response => res.json(response))
        .catch(err => next(err))
})

router.put("/edit-service/:service_id", (req, res) => {

    const { service_id: id } = req.params
    const { name, description, image, totalHours } = req.body

    Service
        .findByIdAndUpdate(id, { name, description, image, totalHours }, { new: true })
        .then(response => res.json(response))
        .catch(error => { next(error) })
})

router.delete('/delete-service/:service_id', (req, res) => {

    const { service_id: id } = req.params

    Service
        .findByIdAndDelete(id)
        .then(response => res.json(response))
        .catch(error => { next(error) })

})





module.exports = router