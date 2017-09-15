const config = require("./config/config");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongo = require("mongodb");
const mongoose = require("mongoose");
mongoose.connect(config.mongoose.url);
const db = mongoose.connection;
const flash = require('connect-flash');

const routes = require("./routes/index");
const users = require("./routes/users");
const test = require("./routes/test");

// Инициализация приложения
const app = express();

// Инициализация шаблонизатора
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs({ defaultLayout: "layout" }));
app.set("view engine", "handlebars");

// Инициализация Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("secret"));

// Указание директории со статическими файлами
app.use(express.static(path.join(__dirname, "public")));

// Express Session
app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}));

// Инициализация Passport
app.use(passport.initialize());
app.use(passport.session());

// Использование flash сообщений
app.use(flash());

// Подключение роутов
app.use("/", routes);
app.use("/users", users);
app.use("/test", test);

// Указание порта
app.set("port", process.env.PORT || config.port);

app.listen(app.get("port"), () => {
    console.log("Server is listening...\nhttp://localhost:%s", app.get("port"));
});