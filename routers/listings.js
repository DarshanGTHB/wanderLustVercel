const express = require("express");
const listingController = require("../controllers/listings.js");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const validateListing = require("../utils/validateListing.js");
const isLoggedIn = require("../utils/isLoggedIn.js");
const isOwener = require("../utils/isOwener.js");
const multer = require("multer");
const {cloudinary,storage} = require("../cloudConfid.js");
const upload = multer({storage})




router
    .get("/",wrapAsync(listingController.getListings))
    .get("/listings", wrapAsync(listingController.getListings)) //Index Route
    .get("/listings/catagory",wrapAsync(listingController.getRandom))
    .get("/listings/new",listingController.getNew) //New Route
    .post("/listings",isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing)) //Create Route
    .get("/listings/:id", wrapAsync(listingController.showLising)) //Show Route
    .get("/listings/:id/edit" ,wrapAsync(listingController.getEditListing)) //Edit Route
    .put("/listings/:id", isLoggedIn, isOwener, upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing)) //Update Route
    .delete("/listings/:id", isLoggedIn,isOwener ,wrapAsync(listingController.deleteListing)) //Delete Route
    .get("/data/searchbar",wrapAsync(listingController.getDataForSearchBar))

    



module.exports = router