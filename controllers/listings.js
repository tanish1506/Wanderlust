const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); 
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken})

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.showListings = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews",populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested , does not exist!!")
        return res.redirect("/listings")
    }
    res.render("./listings/show.ejs",{listing})
}

module.exports.createListings = async (req,res,next)=>{
    // let {title,description,image,price,location,country} = req.body;
    let coordinates = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()
        
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    newListing.geometry = coordinates.body.features[0].geometry;
    
    let savedListing = await newListing.save();
    
    req.flash("sucess", " New Listing Created!!");
    res.redirect("/listings");    
}

module.exports.editListings = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested , does not exist!!")
        return res.redirect("/listings")
    }
    
    //used cloduinary image transformation but if it didnt work added style tag for image size in edit.ejs
    const changedImgUrl = listing.image.url.replace("/upload","/upload/w_250,h_300,c_fill,q_auto,f_auto")
    res.render("listings/edit.ejs",{listing , changedImgUrl });
}

module.exports.updateListings = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save();
    }

    res.redirect(`/listings/${id}`);
}

module.exports.destroyListings = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("sucess","Listing Deleted!!")
    res.redirect("/listings")
}