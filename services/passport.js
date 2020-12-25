//oauth
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
//DB(User Model)
const mongoose = require("mongoose");
const User = mongoose.model("User"); //access to User model(mongoDB)

//Serialize User info to store into cookie
//The first argument is whatever a user model that the app pulls out (an existingUser or newUser from a MongoDB collenction)
passport.serializeUser((user, done) => {
  done(null, user.id); //user.id is ObjectID of a MongoDB record(different from google id like profile.id)
});
//Deserialize data stored in cookie to have an id,
//And use the id to get an instance of MongoDB user instance
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user); // The user instance fetched is stored in req.user
});

//Tell passport to use Google as the authentication strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_ID,
      clientSecret: process.env.OAUTH_SECRET,
      callbackURL: "/auth/google/callback",
    },
    //the callback is invoked once authentication is conducted at Google
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(async (existingUser) => {
        if (existingUser) {
          //the user record already exists
          console.log("Welcome back");
          done(null, existingUser);
        } else {
          //if this is a new user, create a record for them
          const newUser = await new User({
            googleId: profile.id,
            name: profile.name.givenName + " " + profile.name.familyName,
          }).save();
          done(null, newUser);
        }
      });
    }
  )
);
