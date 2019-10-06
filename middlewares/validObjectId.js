const {ObjectId} = require("mongoose").Types;

const validObjectId = (req, res, next) => {
    const {id} = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send("Please specify a valid id");
    }

    next();
};

module.exports = validObjectId;