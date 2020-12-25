const mongoose = require("mongoose");

//Create User Schema for MongoDB
const userSchema = new mongoose.Schema({
  googleId: String,
  name: {
    type: String,
    required: true,
  },
  iconURI: String,
  friendsID: String, //ObjectID of the associated Friends record
});
//Create User Model based on User Schema
const User = mongoose.model("User", userSchema);

module.exports = User;
