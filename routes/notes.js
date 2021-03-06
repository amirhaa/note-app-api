const router = require("express").Router();
const apiValidation = require("../middlewares/apiValidation");
const {
    NoteModel,
    validator
} = require("../models/notes");
const validObjectId = require("../middlewares/validObjectId");
const isAuthenticated = require("../middlewares/isAuthenticated");
const to = require("await-to-js").default;
const {
    pick
} = require("ramda");

// Create
router.post("/", [isAuthenticated, apiValidation(validator)], async (req, res) => {
    const [error, note] = await to(NoteModel.create({
        title: req.body.title,
        content: req.body.content,
    }));

    if (error) return handleDbError(res, error);

    res.status(201).send(note);
});

// Retrieve
router.get("/:id", [isAuthenticated, validObjectId], async (req, res) => {
    const {
        id
    } = req.params;
    const [error, note] = await to(NoteModel.findById(id));

    if (error) return handleDbError(res, error);

    if (!note) return handleNoObjFound(res, id);

    return res.status(200).send(pick(["_id", "title", "content"], note));
});

// Update
router.patch("/:id", [isAuthenticated, validObjectId, apiValidation(validator)], async (req, res) => {
    const {
        id
    } = req.params;
    const [error, note] = await to(NoteModel.findOneAndUpdate({_id: id}, pick(["title", "content"], req.body), {new: true}));

    if (error) return handleDbError(res, error);

    if (!note) return handleNoObjFound(res, id);

    res.status(200).send(pick(["_id", "title", "content"], note));
});

// Delete
router.delete("/:id", [isAuthenticated, validObjectId], async (req, res) => {
    const {
        id
    } = req.params;
    const [error, note] = await to(NoteModel.findByIdAndDelete(id));

    if (error) return handleDbError(res, error);

    if (!note) return handleNoObjFound(res, id);

    return res.status(200).send(pick(["_id", "title", "content"], note));
});

// List
router.get("/", isAuthenticated ,async (req, res) => {
    const [error, notes] = await to(NoteModel.find({}, {'_id': true, 'title': true, 'content': true}));

    if (error) return handleDbError(res, error);

    res.status(200).send(notes);
});

const handleDbError = (res, error) => res.status(500).send(error.message);
const handleNoObjFound = (res, id) => res.status(404).send(`no object found with id ${id}`);

module.exports = router;
