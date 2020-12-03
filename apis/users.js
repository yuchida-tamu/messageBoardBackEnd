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
  //fetch an user by id
  .get(async (req, res, next) => {
    const { id } = req.params;
    User.findById(id, (err, user) => {
      if (err) {
        //if failed, returns json with error property
        res.json({ error: "No matching id" });
      }
      res.json({ method: "GET", user: user });
    });
  })
  //update an user found by id
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
  //deleted an user by id
  .delete((req, res, next) => {
    const { id } = req.params;

    User.findByIdAndRemove(id, (err, user) => {
      if (err) return res.json({ error: "Coudn't delete" });
      //return an user just removed from the collection
      res.json({ method: "DELETE", user: user });
    });
  });

router.route("/:id/messages").get((req, res, next) => {
  const { id } = req.params;
  res.json({ method: "GET" });
});

module.exports = router;
