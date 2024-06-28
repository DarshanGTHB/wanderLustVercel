const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passpotLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passpotLocalMongoose);

const User = mongoose.model("User",userSchema);

module.exports = User;
