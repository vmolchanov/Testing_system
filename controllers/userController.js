const User = require("../models/user");
const Test = require("../models/test");


module.exports = (req, res) => {
    User.getUserById(req.params.userId, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            res.redirect("/");
        }
        let context = {
            title: user.isAdmin ? "Администратор" : "Пользователь",
            userPage: true,
            adminPage: user.isAdmin
        };
        if (user.isAdmin) {
            User.getUsers((err, users) => {
                context.users = users;
                Test.getAllTests((err, tests) => {
                    context.tests = tests;
                    return res.render("admin", context);
                });
            });
        } else {
            return res.render("user", context);
        }
    });
};