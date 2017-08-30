const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const registerController = require("../controllers/registerController");
const User = require("../models/user");


router.post("/register", registerController);

passport.use(new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password"
    },
    (email, password, done) => {
        User.getUserByEmail(email, (err, user) => {
            if (err) {
                throw err;
            }
            if (!user) {
                return done(null, false, { message: "Unknown User" });
            }

            User.comparePassword(password, user.password, (err, isMatch) => {
                if (err) {
                    throw err;
                }
                if (isMatch) {
                    return done(null, user);
                }
                return done(null, false, { message: "Invalid password" });
            });
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, user) => {
        done(err, user);
    });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/users/success",
    failureRedirect: "/users/failure"
}));

router.get("/success", (req, res) => res.send("Authentication was success"));

router.get("/failure", (req, res) => res.send("Authentication was failure"));

module.exports = router;