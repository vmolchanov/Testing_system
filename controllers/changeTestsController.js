const User = require("../models/user");


module.exports = (req, res) => {
    if (req.isAuthenticated()) {
        User.getUserById(req.session.passport.user, (err, user) => {
            if (err) {
                throw err;
            }
            if (!user.isAdmin) {
                return res.status(403).json({ status: "error", reason: "Forbidden" });
            }
            User.getUserByEmail(req.body.user, (err, user) => {
                if (err) {
                    throw err;
                }
                if (!user) {
                    return res.status(400).json({ status: "error", reason: "Пользователь не найден" });
                }

                // К массиву с текущими доступными тестами для пользователя добавляются новые
                req.body.tests.forEach(test => {
                    if (user.availableTests.findIndex(availableTest => availableTest.test === test) === -1) {
                        user.availableTests.push({
                            test: test,
                            solutions: []
                        });
                    }
                });

                // Из массива с текущими доступными тестами для пользователя удаляются лишние
                user.availableTests.forEach((availableTest, availableTestIndex) => {
                    if (req.body.tests.findIndex(test => test === availableTest) === -1) {
                        user.availableTests.splice(availableTestIndex, 1);
                    }
                });

                User.setNewAvailableTests(user, (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log(`Tests for ${user.email} was change successful`);
                    res.json({ status: "success" });
                });
            });
        });
    } else {
        res.redirect("/");
    }
};