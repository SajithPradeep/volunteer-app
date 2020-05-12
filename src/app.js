const express = require("express");

require("./db/mongoose");

const userRouter = require("./router/users")
const itemRouter = require("./router/items")

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(itemRouter);

app.listen(port, () => {
    console.log("Server started on port: ", port);
});