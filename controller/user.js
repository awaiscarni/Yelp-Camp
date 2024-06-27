const User = require('../models/user');

module.exports.registerForm = (req,res) => {
    res.render('user/register');
}

module.exports.registerUser = async(req,res,next)=>{
    try{
    const {email,username,password} = req.body;
    const user= new User({email,username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser,err =>{
        if(err) return next(err);
        req.flash('success','Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
    })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}

module.exports.logInForm = (req,res)=>{
    res.render('user/login');
}

module.exports.logIn = (req,res)=>{
    req.flash('success','Welcome Back');
    const redirectUrl = res.locals.returnTo;
    if(redirectUrl){
        res.redirect('/campgrounds' +redirectUrl);

    }else{
        res.redirect('/campgrounds');
    }
}

module.exports.logOut = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
  }