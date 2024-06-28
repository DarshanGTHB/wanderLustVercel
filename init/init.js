const mongoose = require("mongoose");
const initData = require("./initData.js");
const Listing = require("../models/listing.js");

require("dotenv").config();


const mbxGeooding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_PUBLIC_TOKEN;
const geocodingClient = mbxGeooding({accessToken:mapToken});


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(process.env.ATLAS_MONGO_URL);
    console.log("Connected to MongoDB successfully");
    await addGeomry();
    await initDB();
    console.log("Data was initialized");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    try {
      await mongoose.connection.close();
      console.log("Connection to MongoDB closed");
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
    } finally {
      process.exit();
    }
  }
}



const addGeomry = async ()=>{
  for(let i=0 ; i<initData.data.length ; i++){
    let response = await geocodingClient.forwardGeocode({
      query: initData.data[i].location,
      limit: 1
    })
    .send();
  initData.data[i].geometry = response.body.features[0].geometry;
}

  // console.log(initData.data);
}
  



async function initDB() {
  try {
    await Listing.deleteMany({});
    initData.data = initData.data.map( obj => ({...obj,owner:"66702c9d885aef13ba554961"}));
    await Listing.insertMany(initData.data);
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}



main();
