var mongoose = require("mongoose")
 
var groundSchema = new mongoose.Schema({
     name:String,
     image:String,
     description:String,
     price:String,
     author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "author"
      },

      username:String

     },
     comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments"
     }],
     date: {
      type: Date , default: Date.now}
})

module.exports= mongoose.model("campground" , groundSchema)