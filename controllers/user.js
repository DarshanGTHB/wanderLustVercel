const User = require("../models/user");



exports.getSignUpForm = (req,res) => {
    res.render("users/signup.ejs");
};




exports.createUser = async (req,res,next) => {
    try {
        let {username , email , password} = req.body;
        const u1 = new User({email,username});
        
        let result = await User.register(u1,password);
        req.login(result, err => {
            if(err){
                return next(err);
            }
            console.log(result);
            res.redirect("/listings");
        })
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    }
}



exports.getLogInForm = (req,res) => {
    res.render("users/login.ejs"); 
}


exports.postLogIn = (req, res) => {
    req.flash('success', 'You have successfully logged in');
    const url = res.locals.redirectUrl || "/listings";
    res.redirect(url);
}



exports.logOut = async (req,res) => {
    req.logout( err => {
        if(err){
            return next(err);
        }

        req.flash("success","Logged-Out successfully");
        res.redirect("/listings");

    })
}