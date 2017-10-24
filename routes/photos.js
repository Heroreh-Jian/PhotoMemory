
var express = require("express");
var router  = express.Router();
var Photo= require("../models/photo");
// we are supposed to do var middleware = require("../middleware/index") but index this name is a special filename 
var middleware = require("../middleware/");

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const { isLoggedIn, checkPhotoOwnership} = middleware; // destructuring assignment
const { cloudinary, upload } = require('../middleware/cloudinary');

//INDEX - show all photo files
router.get("/", function(req, res){
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all photos from DB
      Photo.find({name: regex}, function(err, allPhotos){
         if(err){
            req.flash("error", err);
            res.redirect("/photos");
         } else {
            res.status(200).json(allPhotos);
         }
      });
  } else {
      // Get all photo memories from DB
      Photo.find({}, function(err, allPhotos){
         if(err){
            req.flash("error", err);
            res.redirect("/photos");
         } else {
            if(req.xhr) {
              res.json(allPhotos);
            } else {
              res.render("photos/index",{photos: allPhotos, page: 'photos'});
            }
         }
      });
  }
});
// CREATE - add new photo file to DB
router.post("/", isLoggedIn, upload.single('image'), async function foo (req, res){
  // check if file uploaded otherwise redirect back and flash an error message
  if(!req.file) {
    req.flash('error', 'Please upload an image.');
    return res.redirect('back');
  }
  // try/catch for async + await code
  try {
      // get data from form and add to photos array
      let name = req.body.name;
      let desc = req.body.description;
      let author = {
          id: req.user._id,
          username: req.user.username
      };

      // upload image to cloudinary and set resulting url to image variable
      let result = await cloudinary.uploader.upload(req.file.path,function(result) { console.log(result); }, 
  { 
    moderation: "webpurify",
    notification_url: "http://mysite.example.com/hooks" 
  });
      
      let image = result.secure_url;
      // build the newPhoto object
      let newPhoto = {
        name: name,
        image: image,
        description: desc,
        author: author,
      };
      // create photo memory
      await Photo.create(newPhoto);
  } catch (err) {
      req.flash('error', err.message);
  }
  res.redirect('/photos');
});


// //CREATE - add new photo file to DB
// router.post("/", middleware.isLoggedIn, function(req, res){
//     // get data from form and add to photo file array
//     var name = req.body.name;
//     var image = req.body.image;
//     var desc = req.body.description;
//     var created = req.body.created;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     }
//     var newPhoto = {name: name, image: image, description: desc, author:author, created:created}
//     // Create a new photo file and save to DB
//   Photo.create(newPhoto, function(err, newlyCreated){
//         if(err){
//              req.flash("error", err);
//         } else {
//             //redirect back to photo memory page
//             // console.log(newlyCreated);
//             req.flash("success", "You sucessfully created a new photo memory!");
//             res.redirect("/photos");
//         }
//     });
// });

//NEW - show form to create new photo memory
router.get("/new", isLoggedIn, function(req, res){
   res.render("photos/new"); 
});

// SHOW - shows more info about one photo memory
router.get("/:id", function(req, res){
    //find the photo memory with provided ID
    Photo.findById(req.params.id).populate("comments").exec(function(err, foundPhoto){
        if(err || !foundPhoto ){
             req.flash("error", "Sorry, photo memory not found!");
             res.redirect("back");
        } else {
            // console.log(foundPhoto)
            //render show template with that photo memory
            res.render("photos/show", {photo: foundPhoto});
        }
    });
});

// EDIT PHOTO ROUTE
router.get("/:id/edit", checkPhotoOwnership, function(req, res){
    Photo.findById(req.params.id, function(err, foundPhoto){
        res.render("photos/edit", {photo: foundPhoto});
    });
});

// UPDATE PHOTO ROUTE
router.put("/:id", checkPhotoOwnership, function(req, res){
    // find and update the correct photo 
    Photo.findByIdAndUpdate(req.params.id, req.body.photo, function(err, updatedPhoto){
       if(err||!updatedPhoto){
            req.flash("error", "Sorry, photo memory not found!");
            res.redirect("/photos");
       } else {
           //redirect somewhere(show page)
           req.flash("success", "You sucessfully edited the photo memory!");
           res.redirect("/photos/" + req.params.id);
       }
    });
});

// DESTROY PHOTO ROUTE
router.delete("/:id",checkPhotoOwnership, function(req, res){
   Photo.findByIdAndRemove(req.params.id, function(err){
      if(err){
          req.flash("error", "Sorry, photo memory not found!");
          res.redirect("/photos");
      } else {
          req.flash("success", "You sucessfully deleted the photo memory!");
          res.redirect("/photos");
      }
   });
});


module.exports = router;

