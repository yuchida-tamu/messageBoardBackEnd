require("dotenv").config(); //Have to get rid of it in production stage.

const express = require("express");

//cookie management
const cookieSession = require("cookie-session");
const passport = require("passport");

//cors
const cors = require("cors");

//routers
const messages = require("./apis/messages");
const users = require("./apis/users");
const friends = require("./apis/friends");
const oauth = require("./apis/oauth");

const bodyParser = require("body-parser");
//db
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
//If the connection is established, the even "open" will trigger this handler oncegit
db.once("open", () => {
  console.log("DB connected!!!");
});

//Oauth service
require("./services/passport");

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, //30 days TTL
    keys: [process.env.COOKIE_KEY],
  })
);

app.use(passport.initialize());
app.use(passport.session());

//allow all cors request TODO:restrict origin of CORS request
app.use(cors());

app.use(bodyParser.json());

//Root Directory
app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

//Routing for message(s) api
app.use("/api/v1/messages", messages);
//Routing for user(s) api
app.use("/api/v1/users", users);
//Routing for friend(s) api
app.use("/api/v1/friends", friends);
//Routing for auth authentication
app.use("/auth", oauth);

//listen at port 3000 if it couldn't find the environment var
app.listen(process.env.PORT || 3030, () => {
  console.log("running");
});
