const express = require("express");
const router = express.Router();
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

router
  .route("/")
  //Get All messages in the app
  .get(async (req, res, next) => {
    const messages = await Message.find({});
    res.json({ method: "GET", messages: messages });
  })
  //Create a new message
  .post((req, res, next) => {
    const data = req.body;
    //validate the input, and Try to create a Message instance
    try {
      const message = new Message({
        content: data.content,
        date: data.date,
        authorID: data.authorID,
        recipientID: data.recipientID,
      });
      //If a message is creaeted, save the message to MongoDB
      if (message) {
        message.save((err, msg) => {
          if (err)
            return res.json({ error: "Couldn't save the message properly" });
          return res.json({ status: "Message created!!", message: msg });
        });
      }
    } catch (err) {
      //Catch if the inputs are invalid
      res.json({ error: err.errors.message });
    }
  });

//API for a specific message
router
  .route("/:id")
  //Get message
  .get((req, res, next) => {
    //Deconstruct the req.params object
    //Store the query param(:id) to id
    const { id } = req.params;
    res.json({ method: "GET", id: id });
  })
  //Update message
  .put((req, res, next) => {
    //Deconstruct the req.params object
    //Store the query param(:id) to id
    const { id } = req.params;
    const message = req.body;
    res.json({ method: "PUT", content: message });
  })
  //Delete message
  .delete((req, res, next) => {
    //Deconstruct the req.params object
    //Store the query param(:id) to id
    const { id } = req.params;
    res.json({ method: "DELETE", id: id });
  });

//API for User specific message
router
  .route("/:userID")
  .all((req, res, next) => {
    //make sure the userID param has a valid value(i.e objectID for mongoDB)
    //if id is not valid form, abort
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.json({ error: "Invalid id" });
    //if the param is valid, go on to next
    next();
  })
  //Get messages that belong to an user with the requested ID
  .get((req, res, next) => {
    const { userID } = req.params;
    //Fetch messages by the userID
  });

module.exports = router;
