const Joi = require("@hapi/joi");

module.exports = (validator) => {
    return (req, res, next) => {
        try {
            Joi.assert(req.body, validator);
        } catch(error) {
            return res.status(400).send(error.details[0].message);
        }

        next();
    }
}