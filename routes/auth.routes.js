const router = require("express").Router()

const bcrypt = require('bcrypt')
const User = require("../models/User.model")
const saltRounds = 10

const jwt = require('jsonwebtoken')

const { isAuthenticated } = require('./../middleware/jwt.middleware')


router.post('/signup', (req, res, next) => {

    const { email, password, username, avatar } = req.body
    let bankAccountTime = 0


    User
        .create({ email, password, username, avatar, bankAccountTime })
        .then((createdUser) => {

            const { email, hashedPassword, username, avatar } = createdUser
            const user = { email, hashedPassword, username, avatar }

            res.status(201).json({ user })
        })
        .catch(err => next(err))
})


router.post('/login', (req, res, next) => {

    const { email, password } = req.body;

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

                const { _id, email, username, avatar, role, bankAccountTime } = foundUser;

                const payload = { _id, email, username, avatar, role, bankAccountTime }

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
        .catch(err => next(err));
});

router.get('/verify', isAuthenticated, (req, res) => {
    res.status(200).json(req.payload)
})


module.exports = router