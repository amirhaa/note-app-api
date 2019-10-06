const router = require("express").Router();
const apiValidation = require("../middlewares/apiValidation");
const {
    NoteModel,
    validator
} = require("../models/notes");
const validObjectId = require("../middlewares/validObjectId");
const to = require("await-to-js").default;
const {
    pick
} = require("ramda");

// Create
router.post("/", apiValidation(validator), async (req, res) => {
    const [error, note] = await to(NoteModel.create({
        title: req.body.title,
        content: req.body.content,
    }));

    if (error) {
        return res.status(500).send(error.message);
    }

    res.status(201).send(note);
});

// Retrieve
router.get("/:id", [validObjectId], async (req, res) => {
    const {
        id
    } = req.params;
    const [error, note] = await to(NoteModel.findById(id));

    if (error) {
        return res.status(500).send(error.message);
    }

    return res.status(200).send(pick(["_id", "title", "content"], note));
});

// Update
router.patch("/:id", [validObjectId, apiValidation(validator)], async (req, res) => {
    const {
        id
    } = req.params;
    const [error, note] = await to(NoteModel.findByIdAndUpdate(id, pick(["title", "content"], req.body)));

    if (error) {
        return res.status(500).send(error.message);
    }

    res.status(200).send(pick(["_id", "title", "content"], note));
});

// Delete
router.delete("/:id", [validObjectId], async (req, res) => {
    const {
        id
    } = req.params;
    const [error, note] = await to(NoteModel.findByIdAndDelete(id));

    if (error) {
        return res.status(500).send(error.message);
    }

    return res.status(200).send(pick(["_id", "title", "content"], note));
});


// List
router.get("/", async (req, res) => {
    const [error, notes] = await to(NoteModel.find());

    if (error) {
        return res.status(500).send(error.message);
    }

    res.status(200).send(notes);
});

module.exports = router;