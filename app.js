const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp_v2", { useNewUrlParser: true }); // connected to yelp_camp_v2 database
app.use(bodyParser.urlencoded({extended: true}));


// Schema setup
var campgroundSchema = ({
    name: String,
    image: String,
    description: String
});


// making into a model
var Campground = mongoose.model("Campground", campgroundSchema); // makes a model which uses the campgroundSchema

/*
Campground.create(
    {
        name: "Cola Beach", 
        image: "https://lonelyindia.files.wordpress.com/2017/02/cropped-img_20150708_134930360_hdr.jpg",
        description: "Reaching Cola Beach is tough. At least from when coming from North side."
        
    }, (err, campground) => {
        if(err) {
            console.log(err);
        }
        else {
            console.log("Created new campground");
            console.log(campground);
        }
    }
);
*/

app.get("/", (req, res) => { // replace function with => arrow function in es6
    res.render("landing.ejs");
});


// INDEX route - show all campgrounds
app.get("/campgrounds", (req, res) => {
    // get all campgrounds from database
    Campground.find({}, (err, allCampgrounds) => { // {} finds everything
        if(err) {
            console.log(err);
        }
        else {
            res.render("index.ejs", {campgrounds: allCampgrounds}); // {campgrounds: allCampgrounds} the contents of allCampgrounds is sent to campgrounds which is furthur used in index.ejs 
        }
    });
});


// CREATE route - add to campground to database
app.post("/campgrounds", (req, res) => {
    // getting data from the form and adding to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCamp = {name: name, image: image, description: description}
    
    // create new campground and save to database
    Campground.create(newCamp, (err, newlyCreated) => {
        if(err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds"); // redirecting back to campgrounds page
        }
    });
});


// NEW route - show form to create new campground
app.get("/campgrounds/new", (req, res) => { // campgrounds/new will then send the data to the post route
    res.render("new.ejs");
});


// SHOW route - displays additional info for a specific campground
app.get("/campgrounds/:id", (req, res) => {
    // find campground with given ID
    Campground.findById(req.params.id, (err, foundCampground) => { // findById - finds the collection by unique ID
        if(err) {
            console.log(err);
        }
        else {
            res.render("show.ejs", {campground: foundCampground}); // render show.ejs with found Campground
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){ // process.env.PORT, process.env.IP  - environmental viriables set up for cloud9 which we access
    console.log("Server started");
});