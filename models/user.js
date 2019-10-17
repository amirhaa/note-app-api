const {
    Schema,
    model
} = require("mongoose");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    }
});

userSchema.methods.generateHashedPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.token = function () {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        email: this.email
    }, config.get("jwtSecretKey"));
}

module.exports.UserModel = model("User", userSchema);

module.exports.validator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{5,30}$/).required(),
    name: Joi.string().min(3).max(30),
});