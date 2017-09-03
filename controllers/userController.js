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
            userPage: true
        };
        if (user.isAdmin) {
            return res.render("admin", context);
        }
        res.render("user", context);
    });
};