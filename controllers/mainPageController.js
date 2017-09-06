module.exports = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/users/id" + req.session.passport.user);
    }
    res.render("main-page", { title: "Главная" });
};
