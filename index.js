const express = require("express");
const app = express();

const mongoose = require("mongoose");

const listingRouter = require("./routers/listings.js");
const reviewRouter = require("./routers/review.js");
const userRouter = require("./routers/user.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStratergy = require("passport-local");

const User = require("./models/user.js");
require("dotenv").config();

const cors = require('cors');


const MONGO_URL = process.env.ATLAS_MONGO_URL ;

const store = MongoStore.create({
    mongoUrl:MONGO_URL,
    crypto:{
        secret:process.env.SESSION_AND_STORE_SECRET
    },
    touchAfter: 24 * 3600
})

const sessionOptions = {
    secret:process.env.SESSION_AND_STORE_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        exprires:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    },
    store:store
}

app.use(cors());


app.use(session(sessionOptions));
app.use(cookieParser());
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})




/************************************************************************************************** */

const ejsMate = require("ejs-mate");
app.engine('ejs',ejsMate);

/************************************************************************************************** */
////////////////////////////////**********************************************///////////////////////////*/

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname,"/public")));    

////////////////////////////////**********************************************///////////////////////////*/
////////////////////////////////**********************************************///////////////////////////*/

const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

////////////////////////////////**********************************************///////////////////////////*/



async function main() {
    await mongoose.connect(MONGO_URL);
    // await mongoose.connect(process.env.ATLAS_MONGO_URL);
}



main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});



//:::::::::::::::::::::::::::::::::::::::::::::::::::::LISTINGS::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://

app.use("/",listingRouter);

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://



//:::::::::::::::::::::::::::::::::::::::::::::::::::::REVIEW::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://


app.use("/",reviewRouter);


//:::::::::::::::::::::::::::::::::::::::::::::::::::::User:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://



app.use("/",userRouter);



//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
//-------------------------------------------------------------------------------------------------//
//middleware sec


app.all("*",(req, res, next) => {
    next(new ExpressError(404, "From here Page not found......."));
});

app.use((err,req,res,next) => {
    console.log("here:-",err);
    let {status=500 ,message = "Some error Occured"} = err

    //database error.
    if(message.startsWith('Cast to ObjectId failed')){
        message = "Page not found , with Mongo Error..";
        status = 404;
    }


    res.status(status).render("listings/error.ejs", { status , message });
    // res.status(status).send(message);  
});




//--------------------------------------------------------------------------------------------------//





let PORT = 8080
let url ="http://localhost:8080/listings";

app.listen(PORT, () => {
    console.log("server is listening to port ",PORT , url);
});