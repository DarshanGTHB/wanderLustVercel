const express = require("express");
const reviewController = require("../controllers/review.js");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const validateReview = require("../utils/validateReview.js");
const isLoggedIn = require("../utils/isLoggedIn.js");
const isReviewAuthor = require("../utils/isReviewAuthor.js");


router
    .post("/listings/:id/review",isLoggedIn,validateReview,wrapAsync(reviewController.postReviw))
    .delete("/listings/:id/review/:reviewId",isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router