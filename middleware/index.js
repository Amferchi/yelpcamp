  //middleware
  var campground = require("../models/campgrounds.js")
  var comments = require("../models/comments.js")
  var middlewareObj = {};

  middlewareObj.isLoggedin = function(req , res , next){
    if(req.isAuthenticated()){
     return next();
    }
    req.flash("error" , "you need to be logged in to do that")
    res.redirect("/login")
 }

 middlewareObj.checkCampOwner= function(req , res , next){
    if(req.isAuthenticated()){
  campground.findById(req.params.id, function(err , foundCamp){
      if(err){
          res.redirect("back");
      }
      else{
          if(req.user._id.toString() === foundCamp.author.id.toString()){
             next();
           }
  else{
  res.redirect("back");
  }
    }
    })
   }
  }

 
  middlewareObj.checkComOwner = function(req , res , next){
   if(req.isAuthenticated()){
     comments.findById(req.params.comments_id, function(err , comment){
       if(err){
         res.redirect("back")
       }
       else{
        if(req.user._id.toString() === comment.writer.id.toString()){
             next();
         }
        else{ 
          res.redirect("back")}
     } 
     });
   }}

 module.exports = middlewareObj;