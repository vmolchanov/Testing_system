module.exports = (req, res) => {
    res.json({
        status: "success",
        redirect: req.headers.referer + "users/id" + req.session.passport.user
    });
};
