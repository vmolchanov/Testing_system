const User = require("../models/user");


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
                return res.render("admin", context);
            });
        } else {
            return res.render("user", context);
        }
    });
};