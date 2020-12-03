const express = require("express");
const router = express.Router();

router
  .route("/")
  .get((req, res, next) => {
    res.json({ method: "GET" });
  })
  .post((req, res, next) => {
    const user = req.body;
    res.json({ method: "POST", user: user });
  });

router
  .route("/:id")
  .get((req, res, next) => {
    res.json({ method: "GET" });
  })
  .put((req, res, next) => {
    const { id } = req.params;
    const user = req.body;
    res.json({ method: "PUT", id: id, user: user });
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    res.json({ method: "DELETE", id: id });
  });

router.route("/:id/messages").get((req, res, next) => {
  const { id } = req.params;
  res.json({ method: "GET" });
});
router.route("/:id/friends").get((req, res, next) => {
  res.json({ method: "GET" });
});

module.exports = router;
