const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const path = require("path");

const registerController = require("../controllers/registerController");
const successLoginController = require("../controllers/successLoginController");
const failureLoginController = require("../controllers/failureLoginController");
const userController = require("../controllers/userController");
const logoutController = require("../controllers/logoutController");
const loginController = require("../controllers/loginController");
const User = require("../models/user");


router.use(express.static(path.join(__dirname, "../public")));

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

passport.deserializeUser((id, done) => User.getUserById(id, (err, user) => done(err, user)));

router.get("/login", loginController);

router.post("/login", passport.authenticate("local", {
    successRedirect: "/users/success",
    failureRedirect: "/users/failure",
    failureFlash: true
}));

router.get("/success", successLoginController);

router.get("/failure", failureLoginController);

router.all("/id:userId", (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.params.userId === req.session.passport.user) {
            next();
        } else {
            res.redirect("/users/id" + req.session.passport.user);
        }
    } else {
        res.redirect("/");
    }
});

router.get("/id:userId", userController);

router.get("/logout", logoutController);

module.exports = router;