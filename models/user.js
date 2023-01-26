var mongoose = require("mongoose");
var passmonlocal = require("passport-local-mongoose"); 

var UserSchema = new mongoose.Schema({
    username:String,
    password:String
})

UserSchema.plugin(passmonlocal);
module.exports = mongoose.model("User" , UserSchema)