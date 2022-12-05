const router = require("express").Router()

const bcrypt = require('bcrypt')
const User = require("../models/User.model")
const saltRounds = 10

const jwt = require('jsonwebtoken')

const { isAuthenticated } = require('./../middleware/jwt.middleware')


router.post('/signup', (req, res, next) => {

    const { email, password, username, avatar, maxHours } = req.body

    console.log(maxHours, typeof maxHours)

    if (password.length < 2) {
        res.status(400).json({ message: 'Su contraseña debe tener al menos 3 caracteres' })
        return
    }
    User
        .findOne({ email })
        .then((foundUser) => {

            if (foundUser) {
                res.status(400).json({ message: "El usuario ya existe." })
                return
            }

            const salt = bcrypt.genSaltSync(saltRounds)
            const hashedPassword = bcrypt.hashSync(password, salt)

            return User.create({ email, password: hashedPassword, username, avatar, maxHours })
        })
        .then((createdUser) => {
            const { email, hashedPassword, username, avatar, maxHours } = createdUser
            const user = { email, hashedPassword, username, avatar, maxHours }

            res.status(201).json({ user })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "Error interno del servidor" })
        })
})


router.post('/login', (req, res, next) => {

    const { email, password } = req.body;
    console.log(email)

    if (email === '' || password === '') {
        res.status(400).json({ message: "Introduzca email y contraseña" });
        return;
    }

    User
        .findOne({ email })
        .then((foundUser) => {

            if (!foundUser) {
                res.status(401).json({ message: "Usuario no encontrado." })
                return;
            }

            if (bcrypt.compareSync(password, foundUser.password)) {

                const { _id, email, username, avatar, maxHours } = foundUser;

                const payload = { _id, email, username, avatar, maxHours }

                const authToken = jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { algorithm: 'HS256', expiresIn: "6h" }
                )

                res.status(200).json({ authToken });
            }
            else {
                res.status(401).json({ message: "Imposible autenticar al ausuario" });
            }

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "Error interno del servidor" })
        });
});

router.get('/verify', isAuthenticated, (req, res) => {
    res.status(200).json(req.payload)
})


module.exports = router