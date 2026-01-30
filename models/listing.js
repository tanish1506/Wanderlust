const mongoose = require('mongoose');
const  Review = require("./review");
const { string } = require('joi');
const schema =  mongoose.Schema;

const listingSchema = new schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
        url : String,
        filename : String
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : schema.Types.ObjectId,
        ref : "User",
    }
})

listingSchema.post("findOneAndDelete",async(listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})


const Listing = mongoose.model("Listing",listingSchema)
module.exports = Listing;