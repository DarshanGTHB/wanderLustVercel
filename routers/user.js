const express = require("express");
const userController = require("../controllers/user");
const wrapAsync = require("../utils/wrapAsync");
const saveRedirectUrl = require("../utils/saveRedirectUrl");
const passport = require("passport");

const router = express.Router();


router.get("/signup",userController.getSignUpForm)

    .post("/signup",wrapAsync(userController.createUser))

    .get("/login",userController.getLogInForm)

    .post("/login",
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/signup",
            failureFlash: true   // This will set req.flash('error', 'Invalid username or password.') by default
        }),
        userController.postLogIn)
        // wrapAsync(userController.postLogIn)); here well not use wrapAcync cuz function is not acync 

    .get("/logout",wrapAsync(userController.logOut));

    
module.exports = router;