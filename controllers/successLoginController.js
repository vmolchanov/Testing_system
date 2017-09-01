module.exports = (req, res) => {
    res.json({
        status: "success",
        redirect: "/users/id" + req.session.passport.user
    });
};
