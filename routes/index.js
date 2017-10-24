var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");


//root route
router.get("/", function(req, res){
    res.render("landing");
});

// terms route
router.get("/terms", function(req, res){
    res.render("info/terms");
});
//  about route
router.get("/about", function(req, res){
    res.render("info/info");
});
//  contact route
router.get("/contact", function(req, res){
    res.render("info/contact");
});


router.post("/contact", function(req, res){
var api_key = 'key-b16657e4181d86622449afb8b4f7be7e';
var domain = 'sandbox21fe63e81836465a9fa1577ba531bb27.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var data = {
  from: 'PM Inc.<postmaster@sandbox21fe63e81836465a9fa1577ba531bb27.mailgun.org>',
  to: 'jian.yu1208@gmail.com',
  subject: "A Message from" + req.body.name,
  html:"<p><b>Email:</b></p>" + req.body.email+ 
  "<p><b>Phone:</b></p>" + req.body.phone +
  "<p><b>Message:</b></p>" + req.body.message
};
mailgun.messages().send(data, function (err, body) {
    if (err){
        res.send("Oops! Mesesage is not sucessfully delivered.");
        console.log(err);
    } else {
        res.send("Thank you! Your message is sent to Jian Yu PM Inc. We will get back to you ASAP");
    }
});
});
// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            // console.log(err);
            console.log(err);
            req.flash("error",err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            // can have a function to capitalize first letter of username*****
            req.flash("success", "Welcome to Photo Memory " + user.username);
            res.redirect("/photos"); 
        });
    });
});
//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
 
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/photos",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Login Successfully!"
    }), function(req, res){
        
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logout Sucessfully!")
   res.redirect("/photos");
});

module.exports = router;