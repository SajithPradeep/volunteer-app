const express = require('express')
const Item = require('../models/items')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post("/items", auth, async (req, res) => {
    const item = new Item({
        ...req.body,
        owner: req.user._id
    })
    console.log(req.user)
    console.log(item)
    try {
        await item.save()
        res.status(201).send(item)
    } catch (e) {
        res.status(500).send()
    }
});

router.get("/user/items", auth, async (req, res) => {
    try {
        await req.user.populate('items').execPopulate()
        if (req.user.items.length === 0) {
            return res.send({
                message: "No items added by the user"
            })
        }
        res.status(200).send(
            req.user.items
        )
    } catch (e) {
        res.status(400).send()
    }
})

router.get("/items", auth, async (req, res) => {
    try {
        const isAdmin = await req.user.isAdmin()
        if (!isAdmin) {
            return res.send({
                message: "Only Admin has access to view all items"
            })
        }
        const items = await Item.find({})
        res.send(items)
    } catch (e) {
        res.send(e)
    }
})

module.exports = router;