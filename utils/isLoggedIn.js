module.exports = isLoggedIn = (req,res,next) => {
    // console.log(req.originalUrl);
    req.session.redirectUrl = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error","you'r not logged in.");
        return res.redirect("/login");
    }
    next();
}