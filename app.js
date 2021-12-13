require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const _ = require("lodash")

const app = express();
const PORT = process.env.PORT || '3000';

var loginStatus = 0;
app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

function navRender(page, req, res){
  if(req.isAuthenticated()){
    res.render(page, {
      loginStatus: loginStatus,
      profileName: req.user.name,
      profilePic: req.user.photourl,
      user: req.user
    })
  }
  else{
    res.render(page, {
      loginStatus: loginStatus,
      profileName: 0,
      profilePic: 0,
      user: 0
    });
  }
}

app.use(session({
  secret: "our little secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session())
mongoose.connect("mongodb+srv://admin-om:Password@cluster0.0vjgs.mongodb.net/ResDine");

const orderSchema = new mongoose.Schema({
  resName: String,
  guests: Number,
  resTime: String,
  resDate: Date
})
const Order = mongoose.model("Order", orderSchema);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  password: String,
  googleId: String,
  phone: String,
  gender: String,
  photourl: String,
  orders: [orderSchema]
}, {strict: false});

const cityRestaurantSchema = new mongoose.Schema({
  city : String,
  name: String,
  address :String,
  ratings : String,
  phone : String,
  costfor : String,
  openFrom : String,
  openTill : String,
  description: String,
  menuImage: String,
  carouselImages: [String]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);
const cityRestaurant = mongoose.model("cityRestaurant", cityRestaurantSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://morning-harbor-38050.herokuapp.com:" + port+ "/auth/google/resdine",
  },
  function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id, username: profile.emails[0].value, name: profile.displayName, photourl: profile.photos[0].value }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function (req, res) {
  navRender("home", req, res);
});

app.get("/additional", function(req, res){
  navRender("additional", req, res);
})

app.post("/additional", function(req, res){
  User.findOneAndUpdate({googleId : req.user.googleId}, {phone : req.body.phoneNo, address : req.body.addressTextarea}, {upsert: true}, function(err){
    if (err){
      console.log(err);
    }
    else{
      res.redirect("/selectcity");
    }
  });
})

app.get('/auth/google', passport.authenticate('google', { scope: ["email", "profile"] }));

app.get('/auth/google/resdine',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    loginStatus = 1;

    if(req.user.phone === undefined){
      res.redirect("/additional");
    }
    else{
      res.redirect("/selectcity");
    }
  });

app.get("/signup", function (req, res) {
  navRender("signup", req, res);
})

app.post("/signup", function (req, res) {
  User.register({
    username: req.body.username,
    name: req.body.name,
    address: req.body.address,
    phone: req.body.number,
    gender: req.body.gender
  }, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/signup");
    } else {
      passport.authenticate("local")(req, res, function () {
        loginStatus = 1;
        res.redirect("/selectcity")
      })
    }
  })
})

app.get("/login", function (req, res) {
  navRender("login", req, res);
})

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })
  req.login(user, function (err) {
    if (err) { console.log(err) }
    else {
      passport.authenticate("local")(req, res, function () {
        loginStatus = 1;
        res.redirect("/selectcity")
      })
    }
  })
})

app.get("/selectcity", function (req, res) {
  navRender("selectcity", req, res);
})

app.post("/selectcity", function (req, res) {
  res.redirect("/restaurantcity/" + req.body.city);
})

app.get("/restaurantcity/:city", function(req, res){
  const cityName = _.startCase(_.toLower(req.params.city));

  cityRestaurant.find({city : cityName},function(err, foundRestaurants){
    if(err){
      console(err);
    }else{
      if(req.isAuthenticated()){
        res.render("restaurantcity", {
          loginStatus: loginStatus,
          profilePic: req.user.photourl,
          profileName: req.user.name,
          city: cityName,
          restaurants : foundRestaurants
        });
      }
      else{
        res.render("restaurantcity", {
          loginStatus: loginStatus,
          profilePic: 0,
          profileName: 0,
          city: cityName,
          restaurants : foundRestaurants
        });
      }
    }
  })
})

var savedres;
app.get("/restaurantpage/:name",function(req,res){
    const restaurantName = req.params.name;

    cityRestaurant.findOne({name : restaurantName}, function(err, foundRestaurant){
      if (foundRestaurant != null){
        savedres = foundRestaurant;
      }

      if(err){
        console(err);
      }else{
        if(req.isAuthenticated()){
          res.render("restaurantpage", {
            loginStatus: loginStatus,
            profilePic: req.user.photourl,
            profileName: req.user.name,
            restaurant : savedres
          });
        }
        else{
          res.render("restaurantpage", {
            loginStatus: loginStatus,
            profilePic: 0,
            profileName: 0,
            restaurant : savedres
          });
        }
      }
    })
})

app.get("/profile", function(req, res){
  navRender("user_profile", req, res);
})

app.get("/editprofile", function(req, res){
  navRender("edit_profile", req, res);
})

app.get("/resetpassword", function(req, res){
  if (req.user.googleId === undefined){
    navRender("reset_password", req, res);
  }
  else{
    res.redirect("/profile");
  }
})

app.get("/bookings", function(req, res){
  navRender("bookings", req, res);
})

app.post("/payment/:resName", function(req, res){
  if(req.isAuthenticated()){
    let guests = req.body.guests;
    let resDate = req.body.bookingDate;
    let resTime = req.body.time;
    let resName = req.params.resName;

    let newOrder = new Order({
      guests : guests,
      resDate : resDate,
      resName : resName,
      resTime : resTime
    });

    req.user.orders.push(newOrder);
    req.user.save();
  }
  else{
    res.redirect("/signup");
  }

});

app.get("/signout", function(req, res){
  req.logout();
  loginStatus = 0;
  res.redirect("/");
})

app.listen(PORT, function () {
  console.log("Server running on Port 3000");
})
