const router = require("express").Router();
const log = require("log-level");
const apiValidation = require("../middlewares/apiValidation");
const {
    NoteModel,
    validator
} = require("../models/notes");
const to = require("await-to-js").default;

router.post("/", apiValidation(validator), async (req, res) => {
    const [ error, note ] = await to(NoteModel.create({
        title: req.body.title,
        content: req.body.content,
    }));

    console.log(note);

    if (error) {
        return res.status(400).send(error.message);
    }

    res.status(200).send(note);
});

router.get("/", async (req, res) => {
    res.send("heyyyyyyyyyyy")
});

module.exports = router;