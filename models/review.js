const { types, number, date } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    ratings:{
        type:Number
    },
    comment:String,
    date:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }

})

const Review = mongoose.model("Review",reviewSchema)

module.exports = Review