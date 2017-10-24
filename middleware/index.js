var Photo= require("../models/photo");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkPhotoOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Photo.findById(req.params.id, function(err, foundPhoto){
           if(err || !foundPhoto){
               req.flash("error", "Sorry, photo memory not found!");
               res.redirect("back");
           }  else {
               // does user own the photo memory?
            if(foundPhoto.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "Permission Denied--Only photo memory creator can make changes");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "Login is Required");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               req.flash("error", "Comment not found");
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "Permission Denied--Only comment creator can make changes")
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "Login is Required");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Login is Required")
    res.redirect("/login");
}

module.exports = middlewareObj;