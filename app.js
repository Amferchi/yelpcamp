var express = require("express");
var mongoose =require("mongoose");
var app = express()
var passport = require("passport");
var localStrategy = require("passport-local")
var passmonlocal = require("passport-local-mongoose");
var campground = require("./models/campgrounds.js")
var bodyparse = require("body-parser");
var flash = require("connect-flash");
var comments = require("./models/comments.js");
var User = require("./models/user.js");
var override = require("method-override");
var middleware = require("./middleware/index.js");

  app.put("/campgrounds/:id/edit",middleware.checkCampOwner, function(req, res){
    campground.findByIdAndUpdate(req.params.id, req.body.body, function(err, campground){
      if(err){
        return console.log("an error occured")
      }
      res.redirect("/campgrounds/" + campground._id)
    })
  })
   
app.delete("/campgrounds/:id/delete",middleware.checkCampOwner, function(req, res){
  campground.findByIdAndRemove(req.params.id , function(err){
    if(err){
      return res.redirect("/")
    }
     res.redirect("/campgrounds")
  })
})

//edit comment
app.get("/campgrounds/:id/comments/:comments_id/edit",middleware.checkComOwner, function(req, res){ 
  campground.findById(req.params.id , function(err, camp){
    if(err){
      console.log(err)}
    else{
      comments.findById(req.params.comments_id, function(err, foundcomment){
    if(err){
      console.log("oh no an error occured")
    }
    else{ res.render("editcom" , {conew: foundcomment , campground:camp} )}
       
  })}
  });
});

app.put("/campgrounds/:id/comments/:comments_id/edit",middleware.checkComOwner, function(req , res){
   comments.findByIdAndUpdate(req.params.comments_id, req.body.comment, function(err){
     if(err){
      res.redirect("back")
     }
     else{res.redirect("/campgrounds/" + req.params.id)}
   })
})

app.delete("/campgrounds/:id/comments/:comments_id/delete",middleware.checkComOwner, function(req ,res){
  comments.findByIdAndRemove(req.params.comments_id , function(err){
    if(err){res.redirect("back")}
    else{res.redirect("/campgrounds/" + req.params.id)}
  })
})
//game
app.get("/game",isLoggedin, function(req, res){
  res.render("game")
})

  //campgrounds
  app.get("/campgrounds/new",isLoggedin,function(_req ,res) {
 res.render("new.ejs")
  })

  app.get("/", function(_req ,res){
        res.render("landing")
  });

  app.get("/campgrounds",isLoggedin ,function(req , res){
    campground.find({}, function(err , campgrounds){
      if(err){console.log("Oh no an error occured")
    }
    else{res.render("index" , {ground : campgrounds}); }
    })
    
});
  
app.get("/campgrounds/:id/comments/new",isLoggedin, function(req, res ){
  campground.findById(req.params.id , function(err , conew){
    if(err){console.log("oh no an error occured")}
    else{res.render("conew" , {conew:conew})}
  })
})

  app.get("/campgrounds/:id",isLoggedin, function (req ,res){
    campground.findById(req.params.id).populate("comments").exec(function(err , bycamp){
      if(err){console.log("OH NO AN ERROR OCCURED");}
      else{res.render("showpage" , {campground:bycamp})}
    });
  });

  app.post("/campgrounds",isLoggedin, function (req ,res){
     var name =req.body.name
     var image = req.body.image
     var description = req.body.description
     var author = { 
      username: req.user.username,
      id : req.user._id
     
     }
     var newCampground = {name:name, image :image , description: description  , author:author}
     
     campground.create(newCampground , function(err , campground){
      if(err){console.log("OH NO AN ERROR OCCURED");} else{res.redirect("/campgrounds");}
     })
  });


app.post("/campgrounds/:id/comments" ,isLoggedin, function(req , res){ 
  campground.findById(req.params.id , function(err, campground) {
    if(err){console.log(err)}
    else{
       comments.create(req.body.comment, function(err ,comments){
    if(err){console.log("an error occured")}
    else{ 
           comments.writer.id = req.user._id;
           comments.writer.username = req.user.username;
           //save comments
           comments.save();
          campground.comments.push(comments);
           campground.save();
      res.redirect("/campgrounds/" + campground._id)}
   })}  
  })

})


// AUTH ROUTES

  app.get("/register", function(req, res){
    res.render("register");
  })

  app.post("/register", function(req,res){
      User.register(new User({username:req.body.username}), req.body.password, function(err, user){
        if(err){
        console.log(err.message); 
        
        return res.render("register")
        }
        passport.authenticate("local")(req , res , function(){
        req.flash("success" , "Welcome to yelpcamp" + User.username)
           res.redirect("/campgrounds")
        })
      })
  })

  app.get("/login" , function(req,res){
    res.render("login")
  })

  app.get("/logout", function(req, res){
        req.logout(function(err){
          if(err){return(err)}
          res.redirect("/campgrounds")
        })
  })
  app.post("/login", passport.authenticate("local" , {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
  }), function(req,res){
  })

  //middleware
  function isLoggedin(req , res , next){
     if(req.isAuthenticated()){
      return next();
     }
     res.redirect("/login")
  }

  function checkCampOwner(req , res , next){
    if(req.isAuthenticated()){
      campground.findById(req.params.id, function(err , campground){
        if(err){
          res.redirect("back")
        }
        else{
          if(campground.author.id.str == req.user._id){
             next();
          }
          else{
            res.send("you can't do that lol")
          }
        }
      });
    }else{
      res.redirect("back")
    }
  }

  
  function checkComOwner(req , res , next){
    if(req.isAuthenticated()){
      comments.findById(req.params.comments_id, function(err , comment){
        if(err){
          res.redirect("back")
        }
        else{
          if(req.user._id.equals(comment.writer.id)){
            return next();
          }
 
            res.redirect("back")
        }
      });
    }else{
      res.redirect("back")
    }
  }

  app.listen(9000, function(){
      console.log("server is live and active")
    
  });