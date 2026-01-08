const express = require('express');
const app = express()
const mongoose = require('mongoose');
const Listing = require('./models/listing')
const path = require("path")
const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError")
const {listingSchema} = require("./schema.js")

app.engine("ejs", ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")))


main().then(()=>{
    console.log("Connected to database");
}).catch((err) => {
    console.log(err);
})


async function main(){
    await mongoose.connect(Mongo_url)
}


app.get('/',(req,res)=>{
    res.send("Hii I am root")
})

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
app.get("/listings", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}))

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing})
}))

//create route
app.post("/listings", validateListing ,wrapAsync( async (req,res,next)=>{
    // let {title,description,image,price,location,country} = req.body;
    const newListing = new Listing(req.body.Listing)
    await newListing.save();
    res.redirect("/listings");
    
    }
));

//edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);

    res.render("listings/edit.ejs",{listing});
}))

//update route
app.put("/listings/:id", validateListing ,async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.Listing});
    res.redirect("/listings");
})

//delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
}))

//Error handling through ExpressError
app.use((err,req,res,next) => {
    let { statusCode, message} = err;
    // res.status(statusCode).send(message)
    // res.send("Something went Wrong!!");
    res.render("error.ejs",{message})
})

app.listen(8080,()=>{
    console.log('Server is running on port 8080');
})
 