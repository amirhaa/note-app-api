const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
    try {
        const jwtHeader = req.get('Authorization').split('jwt ')[1];
        jwt.verify(jwtHeader, config.get("jwtSecretKey"));

        next();
    } catch(error) {
        res.status(401).send('user is not authorized');
    }
};