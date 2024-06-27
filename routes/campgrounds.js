const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedin} = require('../middleware');
const {validateCampground} = require('../middleware');
const {isAuthor} = require('../middleware');
const campground = require('../controller/campground');
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});


router.route('/')
  .get(catchAsync( campground.index))
  .post(isLoggedin,upload.array('image'), validateCampground,catchAsync( campground.newCampGround))

router.get('/new', isLoggedin, campground.newForm);

router.route('/:id')
  .get(catchAsync(campground.viewCampground ))
  .put(isLoggedin, isAuthor,upload.array('image'),validateCampground, catchAsync( campground.updateCampground))
  .delete(isLoggedin,isAuthor,catchAsync(campground.deleteCampground ))


router.get('/:id/edit',isLoggedin, isAuthor,catchAsync(campground.editCampground));






module.exports =router;
