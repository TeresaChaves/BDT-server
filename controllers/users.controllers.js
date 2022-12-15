const router = require("express").Router()

const User = require('./../models/User.model')
// const Service = require('./../models/Service.model')


const updateHours = (req, res, next) => {
    let hours = parseInt(req.body.hours, 10)

    const user_id = req.payload._id // demandante (caponata)
    const { owner } = req.params // oferente (espinete)
    let hoursOwner //horas oferente (espinete)
    let hoursLoggedUser // horas demandante (caponata)
    let hoursSumOwner
    let hoursSubLoggedUser
    User.findById(owner)

        .then(ownerData => {
            hoursOwner = ownerData.bankAccountTime
            return User.findById(user_id)
        })
        .then(userData => {
            hoursLoggedUser = userData.bankAccountTime
            hoursSumOwner = hoursOwner + hours
            hoursSubLoggedUser = hoursLoggedUser - hours

            if (hoursLoggedUser < hours) {
                res.status(200).json({ error: 'No tienes suficientes horas para contratar el servicio' })

            } else {
                return User.findByIdAndUpdate(owner, { bankAccountTime: hoursSumOwner }, { new: true })
            }
        })
        .then(() => {
            if (hoursLoggedUser < hours) {
                res.status(200).json({ error: 'No tienes suficientes horas para contratar el servicio' })
            } else {

                return User.findByIdAndUpdate(user_id, { bankAccountTime: hoursSubLoggedUser }, { new: true })
            }
        })
        .then(user => res.json(user))
        .catch(error => { next(error) })
}

const getUserHours = (req, res, next) => {
    const { user_id } = req.params

    User
        .findById(user_id)
        .then(user => res.json(user.bankAccountTime))
        .catch(error => { next(error) })
}

module.exports = {
    updateHours,
    getUserHours
}