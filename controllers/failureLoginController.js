module.exports = (req, res) => {
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
