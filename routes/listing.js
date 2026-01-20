const express = require("express")
const router = express.Router()
const Listing = require('../models/listing')
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError")
const {listingSchema , reviewSchema} = require("../schema.js")


//validation of listing schema
const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let  errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}

//index Route
router.get("/", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}))

//new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested , does not exist!!")
        return res.redirect("/listings")
    }
    res.render("./listings/show.ejs",{listing})
}))



//create route
router.post("/", validateListing ,wrapAsync( async (req,res,next)=>{
    // let {title,description,image,price,location,country} = req.body;
    const newListing = new Listing(req.body.listing)
    await newListing.save();
    req.flash("sucess", " New Listing Created!!");
    res.redirect("/listings");
    
    }
));

//edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested , does not exist!!")
        return res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing});
}))

//update route
router.put("/:id", validateListing ,async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect("/listings");
})

//delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("sucess","Listing Deleted!!")
    res.redirect("/listings")
}))

module.exports = router;