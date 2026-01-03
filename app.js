const express = require('express');
const app = express()
const mongoose = require('mongoose');

const Listing = require('./models/listing')
const path = require("path")
const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const methodOverride = require("method-override")



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"));

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

// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "A well furnished home villa with all the amenities",
//         price : 20000,
//         location : "South pacific,Goa",
//         country : "India"
//     })

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("sucessfull testing") 
// })


//index Route
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
})

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//show route
app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing})
})

//create route
app.post("/listings",async (req,res)=>{
    // let {title,description,image,price,location,country} = req.body;
    
    const newListing = new Listing(req.body.Listing)
    await newListing.save();
    res.redirect("/listings");
    console.log(listing);
})

//edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);

    res.render("listings/edit.ejs",{listing});
})

//update route
app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.Listing});
    res.redirect("/listings");
})

//delete route
app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
})


app.listen(8080,()=>{
    console.log('Server is running on port 8080');
})
 