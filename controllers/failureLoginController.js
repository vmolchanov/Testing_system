module.exports = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/users/id" + req.session.passport.user);
    }

    let reason = "";
    let errorField = "";

    switch (req.flash("error")[0]) {
        case "email":
            reason = "Пользователь с таким email не найден";
            errorField = "email";
            break;
        case "password":
            reason = "Неправильный пароль";
            errorField = "password";
            break;
    }
    res.send({
        status: "error",
        reason: reason,
        errorField: errorField
    });
};
