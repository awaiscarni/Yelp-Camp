if(process.env.NODE_ENV !=="production"){
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/user');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const dbUrl = process.env.DB_URL ||'mongodb://127.0.0.1:27017/yelp-camp';
const MongoStore = require('connect-mongo');



mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
  console.log("Mongo Connection Open!!!")
})
.catch(err =>{
  console.log("On no Mongo Connection Error!!")
  console.log(err)
});

const app = express();

app.engine('ejs',ejsMate);
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , 'views'))

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy:false}));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
  mongoUrl: 'mongodb://127.0.0.1:27017/yelp-camp',
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret
  }
});

store.on("error",function(e){
  console.log("Session store error" , e)
})


const sessionConfig = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie:{
    name:'session',
    httpOnly:true,
    // secure:true,
    expires: Date.now() + 1000*60*60*24*7,
    maxAge: 1000*60*60*24*7
  }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(express.static(path.join(__dirname,'public')));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
  res.locals.currentUser = req.user;
  res.locals.success= req.flash('success');
  res.locals.error= req.flash('error');
  next();
})

app.use('/campgrounds' , campgroundRoutes);
app.use('/campgrounds/:id/reviews' , reviewRoutes);
app.use('/', userRoutes);





app.get('/',(req,res) =>{
    res.render('home')
});


app.get('/fakeUser' ,async(req,res) =>{
  const user = new User({email:'apple@gmail.com' , username:'awais'});
  const newUser = await User.register(user,'chiken');
  res.send(newUser);
})





app.all('*' ,(req, res, next) =>{
  next(new ExpressError('Page not Found',404));
})

app.use((err, req, res, next) =>{
  const {statusCode = 500} = err;
  if(!err.message){err.message = 'Oh no, Something went Wrong!'}
  res.status(statusCode).render('error',{err});
})

const port = process.env.PORT || 3000;
app.listen(port,() =>{
    console.log(`Serving on port ${port}`)
});

