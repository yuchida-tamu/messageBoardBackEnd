const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//This api takes care of a friends list of each user
//Each user has their own friends list which identifies itself with ObjectID,
//And identifies its owner with a corresponding userID

//You can Get the list of friends
//Add(Update a list) an user to a friends list
//Remove(Update a list) an user from a friends list
//Create a new list (when a new user is added)
//Delete a list from the collection(when an existing user is removed from app)

//Set up the schema for Friends(which is made up of references to uses)
const friendsSchema = new mongoose.Schema({
  ownerID: {
    type: String,
    required: true,
  },
  //friendsList is an Array of string, which represents ObjectID of an user(aka friend)
  friendsList: {
    type: [String],
    required: true,
  },
});
//Create the "Friends" model, using friendsList as a Schema
const Friends = mongoose.model("Friends", friendsSchema);

router
  .route("/")
  .get(async (req, res, next) => {
    //Get all the friends lists and send it as json
    const lists = await Friends.find({});
    if (lists)
      return res.json({ message: "Fetched all the lists", list: lists });
    return res.json({
      error: "Something went wrong, and Couldn't fetch lists",
    });
  })
  .post((req, res, next) => {
    //Get data from request and create a Friends instance to store to MongoDB
    const friends = new Friends({
      ownerID: req.body.ownerID,
      friendsList: req.body.friendsList,
    });

    friends.save((err, friends) => {
      if (err) return res.json({ error: "Couldn't save the list", msg: err });
      return res.json({ message: "The list is saved", list: friends });
    });
  });

router
  .route("/:userID")
  .all((req, res, next) => {
    //if id is not valid, abort, otherwise, continue
    if (!mongoose.Types.ObjectId.isValid(req.params.userID))
      return res.json({ error: "Invalid id" });
    next();
  })
  .get((req, res, next) => {
    const { userID } = req.params;
    //Get a list that has the corresponding ID as the owner
    Friends.findById(userID, (err, friends) => {
      if (err)
        return res.json({ error: "Couldn't retrieve a friend list", msg: err });
      res.json({ message: "The list is retrieved!", list: friends });
    });
  })
  .put((req, res) => {
    //Add or Remove a friend from a list, and update the result
    //Deconstruct params object to store userID
    const { userID } = req.params;
    //Get data from request to have an updated version of Friends object
    const update = {
      ownerID: userID,
      friendsList: req.body.friendsList,
    };
    //options for update
    const options = {
      new: true,
    };
    //Update
    Friends.findByIdAndUpdate(userID, update, options, (err, friends) => {
      if (err)
        return res.json({ error: "Could not update the list", msg: err });
      return res.json({ message: "Updated", list: friends });
    });
  })
  .delete((req, res, next) => {
    //Delete a list(used when the owner user is removed)
    const { userID } = req.params;
    Friends.findByIdAndRemove(userID, (err, friends) => {
      if (err)
        return res.json({ error: "Could not delete the list", msg: err });
      return res.json({ message: "Removed", list: friends });
    });
  });

module.exports = router;
