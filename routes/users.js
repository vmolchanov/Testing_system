const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const User = require("../models/user");


router.post("/register", registerController);

passport.use(new LocalStrategy((email, password, done) => {
    User.getUserByEmail(email, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            return done(null, false, { message: "Unknown User" });
        }

        User.comparePassword(passport, user.password, (err, isMatch) => {
            if (err) {
                throw err;
            }
            if (isMatch) {
                return done(null, user);
            }
            return done(null, false, { message: "Invalid password" });
        });
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, user) => {
        done(err, user);
    });
});

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/users/success",
        failureRedirect: "/users/failure"
    }),
    loginController
);

router.post("success", (req, res) => res.send("Authentication was success"));

router.post("failure", (req, res) => res.send("Authentication was failure"));

module.exports = router;