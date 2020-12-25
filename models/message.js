const mongoose = require("mongoose");

//Create Message Schema for MongoDB
const messageSchema = new mongoose.Schema({
  content: { type: String, required: [true, "Content is required"] },
  date: { type: Date, default: Date.now },
  authorID: { type: String, required: [true, "authorID is required"] },
  recipientID: { type: String, required: [true, "recipientID is required"] },
});
//Create Message Model based on Message Scheme
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
