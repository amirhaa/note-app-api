const {Schema, model} = require("mongoose");
const Joi = require("@hapi/joi");

module.exports.NoteModel = model("Note", new Schema({
    title: {
        type: String,
        required: true,
    },
    content: String,
}));

module.exports.validator = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    content: Joi.string(),
});
