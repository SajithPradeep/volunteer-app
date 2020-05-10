const express = require("express");

const router = new express.Router();
const User = require("../models/users");
const auth = require("../middleware/auth")

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({
      user,
      token
    });
  } catch (e) {
    if (e.errors) {
      return res.status(500).send({
        message: e.message,
      });
    } else if (e.errmsg) {
      return res.status(500).send({
        messge: "Email Already registered",
      });
    }
    res.status(500).send(e);
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    )
    const token = await user.generateAuthToken()
    res.send({
      user,
      token
    })
  } catch (e) {
    res.status(400).send({
      error: "Unable to login"
    })
  }
})

router.get("/user/profile", auth, async (req, res) => {
  try {
    res.send(req.user)
  } catch (e) {
    res.status(404).send(e)
  }
});

router.patch("/user/update", auth, async (req, res) => {
  const updatesAvailable = ["name", "email", "password", "userType"];
  const update = Object.keys(req.body)

  const isUpdateAllowed = update.every((value) => {
    return updatesAvailable.includes(value)
  })
  if (!isUpdateAllowed) {
    return res.status(400).send({
      error: "Invalid Updates"
    })
  }
  try {
    update.forEach(value => {
      req.user[value] = req.body[value]
    })
    await req.user.save()
    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
  res.send()
})

router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.status(200).send({
      message: "Logout success"
    })
  } catch (e) {

  }
})

router.delete("/users/me", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;