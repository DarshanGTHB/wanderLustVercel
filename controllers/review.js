const Review = require("../models/review")
const Listing = require("../models/listing")



// exports.getReviews = async (req,res,next) => {
//     let {id} = req.params;
//     let listening = await Listing.findById(id);
//     // let reviews 
//     console.log(listening);
//     res.redirect(`/listings/${id}`)
// }



exports.postReviw = async (req,res,next)=>{
    let {id} = req.params; 

    let listening = await Listing.findById(id);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    
    listening.reviews.push(review);
    await listening.save();
    let result = await review.save();

    req.flash("success","Thanks for your review.")
    res.redirect(`/listings/${id}`);
}


exports.deleteReview = async (req,res) => {
    let {id , reviewId} = req.params; 
    await Review.findByIdAndDelete(reviewId);
    let ress = await Listing.findByIdAndUpdate(id,{$pull :{reviews:reviewId}});

    res.redirect(`/listings/${id}`);
}