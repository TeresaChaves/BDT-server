const router = require("express").Router()

const User = require('./../models/User.model')
// const Service = require('./../models/Service.model')


const updateUser = (req, res, next) => {
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
                console.log('no tienes horas capullo')
                res.status(200).json({ error: 'No tienes horas suficientes, Bastardo' })

            } else {
                console.log('sii trabajito!!')
                return User.findByIdAndUpdate(owner, { bankAccountTime: hoursSumOwner })
            }
        })
        .then(() => {
            if (hoursLoggedUser < hours) {
                console.log('no tienes horas capullo')
                res.status(200).json({ error: 'No tienes horas suficientes, Bastardo' })
            } else {

                return User.findByIdAndUpdate(user_id, { bankAccountTime: hoursSubLoggedUser })
            }
        })
        .then(res.status(200))
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
    updateUser,
    getUserHours
}