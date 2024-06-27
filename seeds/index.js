const mongoose = require('mongoose');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{useNewUrlParser:true,  useUnifiedTopology:true})
.then(()=>{
  console.log("Mongo Connection Open!!!")
})
.catch(err =>{
  console.log("On no Mongo Connection Error!!")
  console.log(err)
});

const sample = array =>array[Math.floor(Math.random() * array.length)];

const seedDB = async() =>{
    await Campground.deleteMany({});
    for(let i = 0;i<300; i++){
        const random1000 = Math.floor(Math.random()* 1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author:'650e1375ab6ffed31b82b200',
            geometry: { type: 'Point', coordinates: [ 
              cities[random1000].longitude,
              cities[random1000].latitude
            ] },
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab ea sapiente pariatur eveniet aperiam, omnis vero nostrum alias dicta? Repellat, adipisci. Reprehenderit ex earum saepe tempore eligendi, tenetur laudantium esse?',
            price,
            images:[
              {
                url: 'https://res.cloudinary.com/dkhezazsx/image/upload/v1696119490/YelpCamp/dmlnuka05ikggwul8zuj.avif',
                filename: 'YelpCamp/csi2wkbc27osdqvmg3tm'
              },
              {
                url: 'https://res.cloudinary.com/dkhezazsx/image/upload/v1696119490/YelpCamp/e20qjwus44eplxaxxspc.png',
                filename: 'YelpCamp/vfknbizmxgltkgprd42c'
              }
            ]
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})