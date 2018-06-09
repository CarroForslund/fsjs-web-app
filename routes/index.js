const express = require('express');
const router = express.Router();


// GET search page
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
});

// POST search page
router.post('/', function(req, res, next) {
  //trigger search function (twitter & instagram)
  const hashtag = req.body.hashtag;

  // TODO: Move this function to the right place
  const config = require('./../config/config');

  // ACCESS TWITTER (move?!?)
  const Twit = require('twit');
  const T = new Twit(config.twitter);

  var tweetResults = null;
  var instaResults = null;

  T.get('search/tweets', { q: '#'+ hashtag +' since:2017-01-01', count: 5, lang: 'en' }, function(err, data, response) {
    if(err){
      // TODO: Make sure to throw a proper Error
      console.log("An error occured", err);
    }
    else {
      tweetResults = data.statuses;
    }
  })
  .then(function(){

    //Get instagram posts

  })
  .then(function(){
    res.render('index', {
      user: req.user,
      hashtag: hashtag,
      tweets: tweetResults,
      // instas: instaResults,
    });
  })

});


// GET profile page
router.get('/profile', function(req, res, next) {
  res.render('profile', { user: req.user });
});

// GET login page
router.get('/login', function(req, res, next) {
  res.render('login', { user: req.user });
});

module.exports = router;
