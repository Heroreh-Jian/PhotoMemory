var express = require("express");
var router  = express.Router({mergeParams: true});
var Photo = require("../models/photo");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find photo by id
    // console.log(req.params.id);
    Photo.findById(req.params.id, function(err, photo){
        if(err || !photo){
            req.flash("error", "Sorry, photo memory not found!");
        } else {
             res.render("comments/new", {photo: photo});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup photo memory using ID
   Photo.findById(req.params.id, function(err, photo){
       if(err || !photo){
            req.flash("error", "Sorry, photo memory not found!");
            res.redirect("/photos");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err ||!comment ){
                req.flash("error", "Comment not found");
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               photo.comments.push(comment);
               photo.save();
            //   console.log(comment);
               req.flash("success", "You sucessfully created a new comment!");
               res.redirect("/photos/" + photo._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Photo.findById(req.params.id, function(err, foundPhoto){
        if(err ||!foundPhoto){
            req.flash("error", "Sorry, photo memory not found!");
            return res.redirect("/photos/:id");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err ||!foundComment){
                req.flash("error", "Sorry, comment not found!");
                res.redirect("/:comment_id"); 
            } else {
                res.render("comments/edit", {photo_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err ||!updatedComment){
          req.flash("error", "Sorry, comment not found!");
          res.redirect("photos/:id/comments/:comment_id");
          
      } else {
          req.flash("success", "You sucessfully edited the comment");
          res.redirect("/photos/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
          req.flash("error", "Sorry, comment not found!");
          res.redirect("/photos");
       } else {
           req.flash("success", "You sucessfully deleted the comment");
           res.redirect("/photos/" + req.params.id);
       }
    });
});

module.exports = router;