const config = require("../config/config");
const User = require("../models/user");
const generator = require("generate-password");
const nodemailer = require('nodemailer');
const hbs = require("handlebars");
const fs = require("fs");


module.exports = (req, res) => {
    const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let isValid = regexp.test(req.body.email);

    if (!isValid) {
        return res.send({ "status": "error", "reason": "invalid" });
    }

    User.getUserByEmail(req.body.email, (err, user) => {
        if (user) {
            return res.send({ "status": "error", "reason": "exist" });
        }

        let password = generator.generate({
            length: 8,
            numbers: true
        });

        let newUser = new User({
            email: req.body.email,
            password: password
        });

        User.createUser(newUser, (err, user) => {
            if (err)
                throw err;
            console.log(user);
        });

        res.send({ "status": "success" });

        fs.readFile("./views/email.handlebars", "utf8", (err, data) => {
            if (err)
                throw err;

            let template = hbs.compile(data);
            let context = {
                "email": req.body.email,
                "pass": password
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
                subject: "Регистрация на Test Up",
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


};