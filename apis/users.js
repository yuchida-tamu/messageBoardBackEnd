const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

//Create User Schema for MongoDB
const userSchema = new mongoose.Schema({
  name: String,
  iconURI: String,
  friendsID: String,
});
//Create User Model based on User Schema
const User = mongoose.model("User", userSchema);

router
  .route("/")
  .get(async (req, res, next) => {
    users = await User.find({});
    res.json({ users: users });
  })
  .post(async (req, res, next) => {
    const data = req.body;
    //Check if the record already exists (username(name) has to be unique)
    if (await User.findOne({ name: data.name }).exec()) {
      return res.json({ error: "User already exists" });
    }
    //Create an user based on a post request
    const user = new User({
      name: data.name,
      iconURI: data.iconURL,
      friendsID: data.friendsID,
    });

    user.save((err, user) => {
      if (err) return console.log(err);
    });

    res.json({ method: "POST", user: user });
  });

router
  .route("/:id")
  .all((req, res, next) => {
    //if id is not valid form, abort
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.json({ error: "Invalid id" });
    next();
  })
  .get(async (req, res, next) => {
    const { id } = req.params;
    User.findById(id, (err, user) => {
      if (err) {
        res.json({ error: "No matching id" });
      }
      res.json({ method: "GET", user: user });
    });
  })
  .put((req, res, next) => {
    const { id } = req.params;
    const user = {
      name: req.body.name,
      iconURI: req.body.iconURI,
      friendsID: req.body.friendsID,
    };

    //update options
    const options = {
      new: true,
    };

    User.findByIdAndUpdate(id, user, options, (err, updated) => {
      //if the process fails, return json with error property
      if (err) return res.json({ error: "Update failed" });
      //return the updated version of the user
      res.json({ method: "PUT", user: updated });
    });
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    User.findByIdAndRemove(id, (user) => {
      console.log("Successfully deleted!", user);
    });
  });

router.route("/:id/messages").get((req, res, next) => {
  const { id } = req.params;
  res.json({ method: "GET" });
});
router.route("/:id/friends").get((req, res, next) => {
  res.json({ method: "GET" });
});

module.exports = router;
