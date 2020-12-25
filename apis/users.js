const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//import User model
const User = require("../models/user");
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
    await User.findById(id, (err, user) => {
      if (err) {
        //if failed, returns json with error property
        res.json({ error: "No matching id" });
      }
      res.json({ method: "GET", user: user });
    });
  })
  //update an user found by id
  .put(async (req, res, next) => {
    const { id } = req.params;
    const { name, iconURI, friendsID } = req.body;
    const newUser = {
      name: name,
      iconURI: iconURI,
      friendsID: friendsID,
    };

    //replace user that is attached to request
    if (req.user) {
      req.user = newUser;
    }
    //update options
    const options = {
      new: true,
    };

    await User.findByIdAndUpdate(id, newUser, options, (err, updated) => {
      //if the process fails, return json with error property
      if (err) return res.json({ error: "Update failed" });
      //return the updated version of the user
      return res.json({ method: "PUT", user: updated });
    });
  })
  //deleted an user by id (by admin or by user cancelling their own account)
  .delete((req, res, next) => {
    const { id } = req.params;

    User.findByIdAndRemove(id, (err, user) => {
      if (err) return res.json({ error: "Coudn't delete" });

      //redirect to logout to clear cookie
      res.redirect("http://localhost3030/auth/logout"); //TODO: use Env or Replace with the url for production use
    });
  });

router.route("/:id/messages").get((req, res, next) => {
  const { id } = req.params;
  res.json({ method: "GET" });
});

module.exports = router;
