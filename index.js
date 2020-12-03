require("dotenv").config();
const express = require("express");

//routers
const messages = require("./apis/messages");
const users = require("./apis/users");
const bodyParser = require("body-parser");
//db
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
//If the connection is established, the even "open" will trigger this handler once
db.once("open", () => {
  console.log("DB connected!!!");
});

const app = express();

app.use(bodyParser.json());

//Root Directory
app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

//Routing for message(s) api
app.use("/api/v1/messages", messages);
//Routing for user(s) api
app.use("/api/v1/users", users);

//listen at port 3000 if it couldn't find the environment var
app.listen(process.env.PORT || 3030, () => {
  console.log("running");
});
