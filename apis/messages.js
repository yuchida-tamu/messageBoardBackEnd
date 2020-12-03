const express = require("express");

const router = express.Router();

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
