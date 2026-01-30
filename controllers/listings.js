const Listing = require("../models/listing")


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
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
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
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListings = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListings = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("sucess","Listing Deleted!!")
    res.redirect("/listings")
}