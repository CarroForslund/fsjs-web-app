const express = require('express');
const router = express.Router();
const Flickr = require("node-flickr");
const config = require('./../config/config');

// ACCESS TWITTER (move?!?)
const Twit = require('twit');
const T = new Twit(config.twitter);

// ACCESS FLICKR
const flickr = new Flickr(config.flickr);

// const search = require('./../search');

// GET search page
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
});

// POST search page
router.post('/', function(req, res, next) {
  //trigger search function (twitter & instagram)
  const hashtag = req.body.hashtag;
  let tweetResults = null;
  let instaResults = null;
  const flickrResults = [];


  // TODO: Move this function to the right place

  T.get('search/tweets', { q: '#'+ hashtag +' since:2017-01-01', count: 10, lang: 'en' }, function(err, data, response) {
    if(err){
      // TODO: Make sure to throw a proper Error
      console.log("An error occured", err);
    }
    else {
      tweetResults = data.statuses;
      // console.log("twitterResults are of type", typeof tweetResults);
      // console.log(tweetResults);
    }
  })
  .then(
    flickr.get("photos.search", { "tags": hashtag }, function(err, result){
      if (err) return console.error(err);
      // console.log(result.photos.photo[0].id);
      // const photos = result.photos.photo;
      // tempFlickrResult = result.photos.photo;
      flickrPhotos = result.photos.photo;
      // console.log(result.photos.photo);
      // tempFlickrResult = result.photos;
    })
  )
  .then(function(){

      for (const photo of flickrPhotos){

        flickr.get("photos.getContext", {"photo_id": photo.id }, function(err, result){
          if (err) return console.error(err);
          // console.log(result.prevphoto.title);
          flickrResults.push({
            text: result.prevphoto.title,
            url: result.prevphoto.thumb,
            owner: result.prevphoto.owner
          });
          // photoObj.text = result.prevphoto.title,
          // photoObj.url = result.prevphoto.thumb,
          // photoObj.owner = result.prevphoto.owner
          // // console.log(result.prevphoto.thumb);
          // flickrResults.push(photoObj);
        });
      });
  .then(function(){
    console.log(flickrResults);
    res.render('index', {
      user: req.user,
      hashtag: hashtag,
      tweets: tweetResults,
      flickrPhotos: flickrResults
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
