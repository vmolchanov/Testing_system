const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const registerController = require("../controllers/registerController");
const successLoginController = require("../controllers/successLoginController");
const failureLoginController = require("../controllers/failureLoginController");
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
                return done(null, false, { message: "email" });
            }

            User.comparePassword(password, user.password, (err, isMatch) => {
                if (err) {
                    throw err;
                }
                if (isMatch) {
                    return done(null, user);
                }
                return done(null, false, { message: "password" });
            });
        });
    }
));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, user) => done(err, user));
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/users/success",
    failureRedirect: "/users/failure",
    failureFlash: true
}));

router.get("/success", successLoginController);

router.get("/failure", failureLoginController);

router.all("/id:userId", (req, res, next) => {
    console.log(req.params.userId);
    next();
});

router.get("/id:userId", (req, res) => res.render("user"));

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;