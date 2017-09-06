module.exports = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/users/id" + req.session.passport.user);
    }
    return res.render("login", { title: "Войти" });
};