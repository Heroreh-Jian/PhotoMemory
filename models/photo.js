// PHOTO SCHEMA SETUP
var mongoose = require("mongoose");

var photoSchema = new mongoose.Schema({
    name:String,
    image:String,
    description: String,
    created: {type:Date, default:Date.now},
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Comment"
            
        }
          // this Comment is the name of model 
            ]
});

module.exports = mongoose.model("Photo", photoSchema);