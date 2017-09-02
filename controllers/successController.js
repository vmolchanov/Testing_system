module.exports = (req, res) => {
    let context = {
        successfulRegistration: req.query.depart === "reg",
        successfulReset: req.query.depart === "reset"
    };
    res.render("success", context);
};