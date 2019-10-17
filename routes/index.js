const app = require("../app");
const {baseUrl} = require("../utils/url");
const jwt = require("jsonwebtoken");

module.exports = () => {
    app.use(baseUrl("auth"), require("../routes/auth"));
    app.use(baseUrl("notes"), require("../routes/notes"));

    app.use("*", (req, res) => {
        res.status(404).send("404 Invalid request");
    });
}
