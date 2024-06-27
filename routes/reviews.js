const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const {validateReview , isLoggedin, isReviewAuthor} = require('../middleware');
const review = require('../controller/review');


router.post('/' ,isLoggedin,validateReview, catchAsync(review.createReview));

router.delete('/:reviewId' ,isLoggedin, isReviewAuthor,catchAsync(review.deleteReview));

  


module.exports = router;
