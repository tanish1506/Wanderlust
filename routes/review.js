const express = require("express")
const router = express.Router({mergeParams : true})
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError")
const {listingSchema , reviewSchema} = require("../schema.js")
const Review = require("../models/review.js");
const Listing = require('../models/listing')

//validation of review schema
const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}


//Review post route
router.post("/", validateReview , wrapAsync(async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview)

    await newReview.save();
    await listing.save();
    req.flash("sucess","New Review Created!!")
    
    res.redirect(`/listings/${listing._id}`);
}))

//Delete review route
router.delete("/:reviewid",wrapAsync(async (req,res)=>{
    let {id ,  reviewid} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewid}})
    await Review.findByIdAndDelete(reviewid);
    req.flash("sucess","Review Deleted!!")
    res.redirect(`/listings/${id}`);
}))

module.exports = router;