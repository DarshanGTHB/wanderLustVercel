const Listing = require("../models/listing");

module.exports = isOwener =async (req,res,next) => {
    let {id} = req.params;
    let listing =await Listing.findById(id);
    let owner = listing.owner;

    let currUser = res.locals.currUser._id;

    
    if(!(owner.equals(currUser))){
        req.flash("error","You don't have permission.");
        // return res.send("not allowed");
        return res.redirect(`/listings/${id}`);
    }
    next();
}