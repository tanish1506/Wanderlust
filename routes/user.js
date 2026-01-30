const express = require("express");
const router = express.Router({mergeParams : true});
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares");

const userController = require("../controllers/user");

router.route("/signup")
    //signup get
    .get(userController.renderSignupForm )
    //signup post the user to DB
    .post(wrapAsync(userController.signup))


router.route("/login")
    //login get
    .get(userController.renderLoginForm)
    //login post
    .post(saveRedirectUrl, passport.authenticate('local' , {failureRedirect : '/login' , failureFlash : true}) ,userController.login)

//logout
router.get("/logout",userController.logout)


module.exports = router;