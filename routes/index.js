const app = require("../app");
const {baseUrl} = require("../utils/url");

module.exports = () => {
    app.use(baseUrl("notes"), require("../routes/notes"));
    
    app.use("*", (req, res) => {
        res.status(404).send("404 Invalid request");
    });
}
