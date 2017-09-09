const User = require("../models/user");


module.exports = (req, res) => {
    let email = decodeURIComponent(req.query.user);

    User.getUserByEmail(email, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.status(400).json({ status: "error", reason: "Пользователь не найден" });
        }
        res.json({ status: "success", availableTests: user.availableTests });
    });
};