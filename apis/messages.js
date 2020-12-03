const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Create Message Schema for MongoDB
const messageSchema = new mongoose.Schema({
  content: String,
  date: { type: Date, default: Date.now },
  authorID: String,
});
//Create Message Model based on Message Scheme
const Message = mongoose.model("Message", messageSchema);

router
  .route("/")
  //Get All
  .get((req, res, next) => {
    res.json({ method: "GET" });
  })
  .post((req, res, next) => {
    const message = req.body;
    console.log(message);
    res.json({ method: "POST", content: message });
  });

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

module.exports = router;
