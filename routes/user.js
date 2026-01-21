const express = require("express");
const router = express.Router({mergeParams : true});
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport")

//signup get
router.get("/signup" , (req,res) => {
    res.render("users/signup.ejs")
})

//signup post the user to DB
router.post("/signup",wrapAsync(async (req,res) => {
    try{

        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.flash("sucess", "User registered Sucessfully!!");
        res.redirect("/listings");
    } catch(e){
         req.flash("error",e.message);
         res.redirect("/signup");
    }
    
}))

//login get
router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

//login post
router.post("/login", passport.authenticate('local' , {failureRedirect : '/login' , failureFlash : true}) ,async (req,res) => {
     req.flash("sucess" ,"Welcome back to wanderlust!")
     res.redirect("/listings")
})


module.exports = router;