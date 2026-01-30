const express = require("express")
const router = express.Router({mergeParams : true})
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review.js");
const Listing = require('../models/listing')
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middlewares.js")

const reviewController = require("../controllers/reviews.js");

//Review post route
router.post("/",isLoggedIn, validateReview , wrapAsync(reviewController.createReview))

//Delete review route
router.delete("/:reviewId",isLoggedIn , isReviewAuthor ,wrapAsync(reviewController.destroyReview))

module.exports = router;