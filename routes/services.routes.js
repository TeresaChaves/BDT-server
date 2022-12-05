const router = require("express").Router();

const Service = require('./../models/Service.model')


router.get("/", (req, res, next) => {
    res.json("All good in here");
});


router.get("/allServices", (req, res) => {

    Service
        .find()
        // .select({ title: 1, imageUrl: 1 })
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


router.post("/addService", (req, res) => {

    Service
        .create(req.body)
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))
})


module.exports = router