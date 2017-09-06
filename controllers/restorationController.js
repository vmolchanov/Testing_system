const config = require("../config/config");
const User = require("../models/user");
const generator = require("generate-password");
const nodemailer = require("nodemailer");
const hbs = require("handlebars");
const fs = require("fs");


module.exports = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/users/id" + req.session.passport.user);
    }

    if (req.method === "PUT") {
        User.getUserByEmail(req.body.email, (err, user) => {
            if (err) {
                throw err;
            }
            if (!user) {
                return res.json({
                    status: "error",
                    reason: "Пользователь с указанным email не зарегистрирован"
                });
            }

            let password = generator.generate({
                length: 8,
                numbers: true
            });

            user.password = password;

            User.setNewPassword(user, (err, user) => {
                if (err) {
                    throw err;
                }
                console.log("User password was update.");
            });

            res.send({ status: "success", redirect: "/success" });

            fs.readFile("./views/email.handlebars", "utf8", (err, data) => {
                if (err) {
                    throw err;
                }

                let template = hbs.compile(data);
                let context = {
                    resetPasswordEmail: true,
                    email: req.body.email,
                    pass: password
                };

                let transporter = nodemailer.createTransport({
                    service: config.email.service,
                    auth: {
                        user: config.email.auth.user,
                        pass: config.email.auth.pass
                    }
                });

                let mailOptions = {
                    from: config.email.address,
                    to: req.body.email,
                    subject: "Сброс пароля",
                    html: template(context)
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });
            });
        });
    }

    if (req.method === "GET") {
        res.render("reset-password");
    }
};