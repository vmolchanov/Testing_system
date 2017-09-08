const fs = require("fs");
const path = require("path");
const dataurl = require("dataurl");
const User = require("../models/user");
const Test = require("../models/test");
const ObjectId = require("mongodb").ObjectId;


module.exports = (req, res) => {
    if (req.isAuthenticated()) {
        User.getUserById(req.session.passport.user, (err, user) => {
            if (err) {
                throw err;
            }

            if (req.method === "GET") {
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
            }
            if (req.method === "POST") {
                if (!user.isAdmin) {
                    res.status(403).json({ status: "error", reason: "Forbidden" });
                }

                let images = [];
                let imgCounter = 1;
                let objectId = new ObjectId();

                fs.mkdirSync(path.join(__dirname, `/../public/img/${objectId}`));

                req.body.data.forEach(item => {
                    if (item.file) {
                        let img = dataurl.parse(item.file);
                        let imgType = img.mimetype.slice(img.mimetype.indexOf("/") + 1);
                        images.push({
                            img: img.data,
                            path: path.join(__dirname, `/../public/img/${objectId}/${imgCounter++}.${imgType}`)
                        });
                        item.file = `img/${objectId}/${imgCounter}.${imgType}`;
                    }
                });

                let test = new Test({
                    _id: objectId,
                    name: req.body.name,
                    questionsCount: req.body.questionsCount,
                    data: req.body.data
                });

                Test.addTest(test, (err, addedTest) => {
                    if (err) {
                        throw err;
                    }
                    console.log("Test was added");
                    res.json({ status: "success", redirect: `/users/id${req.session.passport.user}` });

                    images.forEach(image => {
                        fs.writeFile(image.path, image.img, err => {
                            if (err) {
                                throw err;
                            }
                            console.log("Image was saved");
                        });
                    });
                });
            }
        });
    } else {
        res.redirect("/");
    }
};