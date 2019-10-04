const app = require("../app");
const {baseUrl} = require("../utils/url");

module.exports = () => {
    app.use(baseUrl("notes"), require("../routes/notes"));
}
