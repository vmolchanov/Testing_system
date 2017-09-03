module.exports = (req, res) => {
    let context = {
        successfulRegistration: req.query.depart === "reg",
        successfulReset: req.query.depart === "reset"
    };
    if (context.successfulRegistration) {
        context.title = "Регистрация прошла успешно";
    }
    if (context.successfulReset) {
        context.title = "Пароль был успешно сброшен";
    }
    res.render("success", context);
};