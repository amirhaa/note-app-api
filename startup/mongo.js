const mongoose = require("mongoose");
const config = require("config");
const log = require("log-level");

const dbConnection = config.get("mongodb.connection");
const dbName = config.get("mongodb.dbName");

module.exports = () => {
    mongoose.connect(`${dbConnection}/${dbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(log.success(`successfully connected to mongodb on ${dbConnection}/${dbName} ...`))
    .catch(log.error.bind(log, "mongodb connection error: "));

    mongoose.connection.on("error", log.error.bind(log, "Error in mongo connection: "));
    mongoose.connection.on("close", log.info.bind(log, "Mongo connection closed: "));
}
