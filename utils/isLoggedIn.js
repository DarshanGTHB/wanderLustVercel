module.exports = isLoggedIn = (req,res,next) => {
    // console.log(req.originalUrl);
    req.session.redirectUrl = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error","you'er not logged in.");
        return res.redirect("/login");
    }
    next();
}
