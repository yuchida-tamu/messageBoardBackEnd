const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router
  .route("/:id")
  .all((req, res, next) => {
    //if id is not valid, abort, otherwise, continue
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.json({ error: "Invalid id" });
    next();
  })
  .get((req, res, next) => {
    const { id } = req.params;
    res.json({ friends: id });
  });

module.exports = router;
