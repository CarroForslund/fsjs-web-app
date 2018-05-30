var express = require('express');
var router = express.Router();
var User = require('../models/user');

// GET register page
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Signup' });
});

// POST signup page
router.post('/signup', function(err, req, res, next) {
  console.log('post route');
  if (  req.body.email &&
        req.body.name &&
        req.body.password &&
        req.body.confirmPassword ) {

    console.log('all fields are filled');
    // Confirm that the user typed in the same password twice
    if (req.body.password !== req.body.confirmPassword) {
      console.log('password and confirmPasswords are equal');
      var err = new Error('Passwords do not match.');
      err.status = 400;
      return next(err);
    }

    // Create user object with form input
    var userData = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password
    }

    // Use the schemas's create method to insert document into Mongo
    User.create (userData, function (error, user) {
      console.log('user');
      if (error) {
        return next(error);
      }
      else {
        return res.redirect('/profile');
      }
    });
  }
  else  {
    console.log('error');
    var err = new Error('All fields are required.');
    err.status = 400;
    return next(err);
  }
});

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Signup', user: req.user });
});

// GET home page
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Hashtag Finder' });
});

// GET profile page
router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Profile', user: req.user });
});

// GET login page
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Log In', user: req.user });
});

module.exports = router;
