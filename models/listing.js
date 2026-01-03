const mongoose = require('mongoose');

const schema =  mongoose.Schema;

const listingSchema = new schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
        default : "https://plus.unsplash.com/premium_photo-1673002094195-f18084be89ce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3Vuc2V0fGVufDB8fDB8fHww",
        type : String,
        set : (v) => v=== "undefined" ? "https://plus.unsplash.com/premium_photo-1673002094195-f18084be89ce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3Vuc2V0fGVufDB8fDB8fHww" : v,
    },
    price : Number,
    location : String,
    country : String,
})

const Listing = mongoose.model("Listing",listingSchema)
module.exports = Listing;