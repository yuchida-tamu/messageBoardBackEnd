const mongoose = require("mongoose");
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

module.exports = Friends;
