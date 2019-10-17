const router = require("express").Router();
const {UserModel, validator} = require("../models/user");
const {pick} = require("ramda");
const to = require("await-to-js").default;
const apiValidation = require("../middlewares/apiValidation");

router.post("/register", apiValidation(validator), async (req, res) => {
    const [_, registeredUser] = await to(UserModel.findOne({ email: req.body.email }));

    // Note: This is not a good way to tell client this !!!!!!!!!!!!!!!!!
    if (registeredUser) {
        return res.status(400).send('a user already registered with this email');
    }

    const newUser = new UserModel(pick(['name', 'email'], req.body));
    newUser.password = newUser.generateHashedPassword(req.body.password);

    const [error, user] = await to(newUser.save());

    if (error) {
        return res.status(500).send(error.message);
    }

    res.status(201).send({ ...pick(['_id', 'name', 'email'], user), token: user.token() });
});

router.post("/token", apiValidation(validator), async (req, res) => {
    const [error, user] = await to(UserModel.findOne({ email: req.body.email }));
    
    if (error) {
        return res.status(500).send(error.message);
    }

    if (!user || !user.validPassword(req.body.password)) {
        return res.status(404).send('email or password is wrong or no user registered yet');
    }

    res.status(200).send({ token: user.token() });
});

module.exports = router;
