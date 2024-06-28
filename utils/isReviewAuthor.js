const Review = require("../models/review");

module.exports = isReviewAuthor = async (req,res,next) => {
    let {reviewId , id} = req.params;

    let review = await Review.findById(reviewId);


    if(!(review.author.equals(res.locals.currUser._id))){
        req.flash("error","This action is not allowed to you.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}