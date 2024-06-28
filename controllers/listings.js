require("dotenv").config();
const Listing = require("../models/listing")
const mbxGeooding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_PUBLIC_TOKEN;
const geocodingClient = mbxGeooding({accessToken:mapToken});








function shuffleArray(array) {
    // Create a copy of the original array to avoid modifying it directly
    let shuffledArray = array.slice();

    // Fisher-Yates shuffle algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        // Swap elements at i and j
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
}








////Listing controllers//////

exports.getListings = async (req, res) => {
    const allListings = await Listing.find({});

    res.render("listings/index.ejs", { allListings });
}



exports.getNew = (req, res) => {
    res.render("listings/new.ejs");
}



exports.createListing = async (req, res ,next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send();
    let url = req.file.path;
    let filename = req.file.filename;
    if(!req.body.listing){
        throw new ExpressError(400,"A bad request")
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    
    console.log(newListing);
    await newListing.save();
    req.flash("success","Listing is created successfully..");
    res.redirect("/listings");  
}


exports.showLising = async (req, res) => {
    let { id } = req.params;
    // console.log(id);
    const listing = await Listing.findById(id)
                        .populate({
                            path:"reviews",
                            populate:{path:"author"}
                        }
                    )
                    .populate("owner");    
    let reviews = listing.reviews;
    res.render("listings/show.ejs", { listing ,reviews });
}



exports.getEditListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let previewUrl = listing.image.url;
    // previewUrl = previewUrl.replace("/upload","/upload/w_300,h_250");
    res.render("listings/edit.ejs", { listing , previewUrl});
}



exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let newOne = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(req.file){
        newOne.image.url = req.file.path;
        newOne.image.filename = req.file.filename;
    }

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send();

    newOne.geometry = response.body.features[0].geometry;

    await newOne.save();

    res.redirect(`/listings/${id}`);
}




exports.deleteListing =  async (req, res) => {
    
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing,"im in delete routew");
    
    
    req.flash("success","Listing is Deleted  successfully..");
    res.redirect("/listings");
}




exports.getDataForSearchBar = async (req,res) => {
    let result = await Listing.find();
    res.json(result);
}




exports.getRandom = async (req,res)=>{
    let allListings = await Listing.find({});
    
    allListings = shuffleArray(allListings);
    res.render("listings/index.ejs", { allListings });
}