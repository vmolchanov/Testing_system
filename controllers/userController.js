const User = require("../models/user");
const Test = require("../models/test");
const ObjectId = require("mongodb").ObjectId;


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
        Test.getAllTests((err, tests) => {
            if (err) {
                throw err;
            }

            if (user.isAdmin) {
                User.getUsers((err, users) => {
                    if (err) {
                        throw err;
                    }
                    context.users = users;
                    context.tests = tests;
                    return res.render("admin", context);
                });
            } else {
                context.tests = user.availableTests.map(availableTest => {
                    return tests.find(test => availableTest.test === String(test._id)).name;
                });

                return res.render("user", context);
            }
        });
    });
};