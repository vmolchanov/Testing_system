const User = require("../models/user");


module.exports = (req, res) => {
    if (req.isAuthenticated()) {
        User.getUserById(req.session.passport.user, (err, user) => {
            if (err) {
                throw err;
            }
            if (!user) {
                res.redirect("/");
            }
            if (!user.isAdmin) {
                res.redirect("/users/id" + user._id);
            }
            res.render("add-test", {
                title: "Добавить тест",
                userPage: true,
                adminPage: true
            });
        });
    }
};