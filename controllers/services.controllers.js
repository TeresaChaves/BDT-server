const router = require("express").Router()
const { isAuthenticated } = require("../middleware/jwt.middleware");

const Service = require('./../models/Service.model')


const getServices = (req, res) => {

    Service
        .find()
        .select({ name: 1, image: 1, owner: 1 })
        .then(response => res.json(response))
        .catch(err => res.status(500).json(err))

}

const getOneService = (req, res, next) => {

    const { service_id } = req.params

    Service
        .findById(service_id)
        .then(response => res.json(response))
        .catch(err => next(err))
}


const saveService = (req, res, next) => {

    const { name, description, image, date, status } = req.body
    const { _id: owner } = req.payload

    Service
        .create({ name, description, image, date, status, owner })
        .then(response => res.json(response))
        .catch(err => next(err))
}

const editService = (req, res, next) => {

    const { service_id } = req.params
    const { name, description, image } = req.body

    Service
        .findByIdAndUpdate(service_id, { name, description, image }, { new: true })
        .then(response => res.json(response))
        .catch(error => { next(error) })
}


const deleteService = (req, res, next) => {

    const { service_id } = req.params

    Service
        .findByIdAndDelete(service_id)
        .then(response => res.json(response))
        .catch(error => { next(error) })
}



module.exports = {
    getServices,
    getOneService,
    saveService,
    editService,
    deleteService
}