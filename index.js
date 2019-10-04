const config = require("config");
const log = require("log-level");
const http = require("http");
const app = require("./app");

log.info(`start running app on ${config.util.getEnv("NODE_ENV")} ...`);

// Connect to mongodb
require("./startup/mongo")();

// Handle routes
require("./routes")();

// Run server
// Start the server
const port = config.util.getEnv("PORT") || 3000;
const server = app.listen(port, () => {
    log.highlight(`Start server...listening on port ${port}...`)
});

module.exports = server;
