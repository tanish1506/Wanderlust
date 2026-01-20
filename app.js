const express = require('express');
const app = express()
const mongoose = require('mongoose');
const path = require("path")
const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError")
const session = require("express-session")
const flash = require("connect-flash")

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

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

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true ,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
}

app.get('/',(req,res)=>{
    res.send("Hii I am root")
})

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) => {
    res.locals.sucess = req.flash('sucess');
    res.locals.error = req.flash('error')
    next();
})


app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews);


//Error handling through ExpressError
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found"))
})

app.use((err,req,res,next) => {
    let { statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080,()=>{
    console.log('Server is running on port 8080');
})
 