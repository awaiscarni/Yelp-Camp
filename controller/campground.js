const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken:mapBoxToken});
const {cloudinary} = require('../cloudinary')

module.exports.index = async (req,res) =>{
    const campgrounds = await Campground.find({});
    res.render('../views/index',{campgrounds});
}

module.exports.newForm = (req,res) =>{
    res.render('../views/new');
  }


module.exports.newCampGround = async (req,res, next) =>{
    const geodata= await geocoder.forwardGeocode({
      query:req.body.campground.location,
      limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry= geodata.body.features[0].geometry;
    campground.images = req.files.map(f =>({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash('success','Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`)
  }

module.exports.viewCampground = async (req,res) =>{
    const campground = await Campground.findById(req.params.id).populate('author').populate({
      path:'reviews',
      populate:{
        path:'author'
      }
    });
    if(!campground){
      req.flash('error','Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
    res.render('../views/show',{campground });
  }

module.exports.editCampground = async(req,res) =>{
    const {id} =req.params;
    const campground = await Campground.findById(id);
    if(!campground){
      req.flash('error','Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
    res.render('../views/edit' , {campground});
  }

module.exports.updateCampground = async(req,res,next) =>{
    const campground = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground});
    const img = req.files.map(f =>({url: f.path, filename: f.filename}));
    campground.images.push(...img);
    await campground.save();
    if(req.body.deleteImages){
      for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename);
      }
      const hemloo = await campground.updateOne({ $pull:{images: {filename:{$in: req.body.deleteImages}}}});
      console.log(hemloo);
    }
    
    req.flash('success','Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  }

module.exports.deleteCampground = async (req,res) =>{
    const campground = await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
  }