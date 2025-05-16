const router = require("express").Router();
const { chat, chatApi } = require('../controllers/chat.js')

router.get("/chat", chatApi)

module.exports = router