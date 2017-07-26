const config = require("./config/config");

const express = require("express");
const app = express();

const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("cookie-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const handlebars = require("express-handlebars").create({ defaultLayout: "./views/layouts/index", extname: ".hbs" });
const passwordHash = require("password-hash");

const mainPageController = require("./controllers/mainPageController");
const userController = require("./controllers/userController");

app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ keys: ["secret"] }));
app.use(passport.initialize());
app.use(passport.session());

app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");

passport.use(new LocalStrategy((username, password, done) => {

    console.log("local strategy");

    UserModel.findOne({ email: username }, (err, person) => {
        if (err) {
            console.log(err);
            return done(err);
        }

        if (person) {
            if (passwordHash.verify(password, person.password)) {
                return done(null, person);
            } else {
                return done(null, false, { message: "Неправильный пароль" });
            }
        } else {
            return done(null, false, { message: "Пользователь не найден" });
        }
    });

}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    done(null, { id: id });
});

app.get("/", mainPageController);

app.post("/signin", (req, res, next) => {
    console.log("in function");

    passport.authenticate("local", function (err, user, info) {
        console.log("auth");

        if (err) {
            console.log("err");
            return next(err);
        }

        if (!user) {
            console.log("user");
            return res.status(401).send("Bad");
        }

        return res.render("user");
    })(req, res, next);
});

const mustBeAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect("/");

app.all("/user", mustBeAuthenticated);

app.get("/user", userController);

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.listen(config.port, () => console.log("Server is listening..."));
