const User = require("../models/user");


module.exports = (req, res) => {
    User.getUserByEmail(req.query.user, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.json({
                status: "error",
                reason: "Пользователь не найден"
            });
        }
        res.json({
            status: "success",
            availableTests: user.availableTests
        });
    });
};