var mongoose = require("mongoose");
var passmonlocal = require("passport-local-mongoose"); 

var UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    username:String,
    password:String
})

UserSchema.plugin(passmonlocal);
module.exports = mongoose.model("User" , UserSchema)