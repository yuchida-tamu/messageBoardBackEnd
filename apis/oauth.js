/*
This router takes care of authentication.
Once user is authenticated, the user info will be fetched from DB,
and its instance can be accessed at req.user for further uses in the application
*/

const express = require("express");
const passport = require("passport");
const router = express.Router();

//route for OAuth with Google
router.route("/google").get(
  passport.authenticate("google", { scope: ["profile", "email"] }) //"scope" defines what info is allowed to be accessed by the authentication
);
//route for After authentication goes through
router.route("/google/callback").get(passport.authenticate("google"));

router.route("/current_user").get((req, res) => {
  res.send(req.user);
});

router.route("/logout").get((req, res) => {
  req.logout(); //logout, clear out the cookie
  res.send(req.user);
});

module.exports = router;
