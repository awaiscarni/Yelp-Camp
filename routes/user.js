const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const user = require('../controller/user');

router.route('/register')
    .get(user.registerForm)
    .post(catchAsync( user.registerUser ))

router.route('/login')
    .get(user.logInForm)
    .post( storeReturnTo ,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),user.logIn)

    
router.get('/logout', user.logOut); 

module.exports = router;