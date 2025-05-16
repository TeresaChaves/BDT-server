const router = require("express").Router()
const express = require("express");
const app = express();
const http = require("http").createServer(app);

const io = require("socket.io")(http, {
    path: "/socket.io",
    cors: {
        origin: [process.env.DOMAIN],
        methods: ["GET", "POST"],
        allowedHeaders: ["content-type"],
    },
});

const chat = (io) => {

    io.on("connection", (socket) => {
        console.log("socket id", socket.id)
        // socket.on("disconnected")
        // console.log("user disconnected")

    })

}

chat(io)

const chatApi = (req, res) => {
    res.send("this is the rest api")
}

module.exports = {
    chat,
    chatApi
}