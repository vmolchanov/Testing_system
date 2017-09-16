module.exports = (req, res) => {
    res.clearCookie("testId");
    res.clearCookie("questionIndexes");
    res.clearCookie("currentIndex");
    res.clearCookie("correctAnswer");

    req.logout();
    res.redirect("/");
};