module.exports = (req, res) => {
    res.send({
        status: "error",
        reason: req.flash("error")[0]
    });
};
