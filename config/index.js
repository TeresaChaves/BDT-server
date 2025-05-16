const express = require("express");

const logger = require("morgan");

const cookieParser = require("cookie-parser");

const cors = require("cors");

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:3000";

// Middleware configuration
module.exports = (app) => {

  app.set("trust proxy", 1);

  // controls a very specific header to pass headers from the frontend
  app.use(
    cors({
      origin: ["http://localhost:3000", process.env.ORIGIN]
    })
  );

  app.use(logger("dev"));


  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

};
