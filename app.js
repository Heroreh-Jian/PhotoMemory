
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    cookieParser = require("cookie-parser"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    // Photo = require("./models/photo"),
    // Comment     = require("./models/comment"),
    User        = require("./models/user");
    // seedDB      = require("./seeds");
require('dotenv').config(); 
//requiring routes
var commentRoutes    = require("./routes/comments"),
    photoRoutes = require("./routes/photos"),
    indexRoutes      = require("./routes/index");
mongoose.Promise = global.Promise;    
const url = process.env.DATABASEURI || "mongodb://localhost/photo_memory";
mongoose.connect(url, { useMongoClient: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser('secret'));
app.use(methodOverride("_method"));
// be sure to use flash() before passport config
app.use(flash());
app.locals.moment=require("moment");
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Good Photos with Good Memories",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/photos", photoRoutes);
app.use("/photos/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server Connected!");
});




