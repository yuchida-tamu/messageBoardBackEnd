const express = require("express");
const router = express.Router();

router.route("/:id").get((req, res, next) => {
  const { id } = req.params;
  res.json({ friends: id });
});

module.exports = router;
