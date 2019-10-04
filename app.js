const express = require("express");
const morgan = require("morgan");
const config = require("config");

// Create app
const app = express();

// Base middlewares
app.use(express.json());
app.use(morgan(config.get("settings.morganLogLevel")));

module.exports = app;
