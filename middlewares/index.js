const checkIfAuth = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash("error_messages", "You must be logged in to view this.")
        res.redirect("/user/login")
    }
}

module.exports = { checkIfAuth }