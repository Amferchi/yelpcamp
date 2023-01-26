var mongoose= require("mongoose");

var CommentSchema = new mongoose.Schema({
    writer: { 
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:String
    },
    info: String
})


module.exports = mongoose.model("comments", CommentSchema);

