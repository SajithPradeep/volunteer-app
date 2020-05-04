const express = require('express')

const router = new express.Router();
const User = require("../models/users")

router.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save()
        res.status(201).send({
            user
        })
    } catch (e) {
        if (e.errors) {
            return res.status(500).send({
                message: e.message
            })
        } else if (e.errmsg) {
            return res.status(500).send({
                messge: "Email Already registered"
            })
        }
        res.status(500).send(e)
    }
})


router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).send({
                message: "Cannot find user"
            });
        }
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
})

module.exports = router;