'use strict';
const express = require('express');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const passport = require('passport');
// const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
// const User = require('./models/user');
const Twit = require('twit');
const config = require('./config/twitter-config');
const T = new Twit(config);

// Get Hashtag results from Instagram


const app = express();

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  // TODO: Move this function to the right place
  // Get Hashtag results from Twitter
  // function tweetFinder(hashtag){
    // T.get('search/tweets', { q: hashtag + ' since:2017-01-01', count: 20, lang: 'en' }, function(err, data, response) {
    T.get('search/tweets', { q: '#pony since:2017-01-01', count: 5, lang: 'en' }, function(err, data, response) {
      if(err){
        // TODO: Make sure to throw a proper Error
        console.log("An error occured", err);
      }
      else {
        // TODO: Make sure the right values are being saved
        const tweets = data.statuses;
        console.log(tweets[0]);
        res.locals.tweets = tweets;
        // tweets[X].created_at
        // tweets[X].text
        // tweets[X].retweet_count
        // tweets[X].favorite_count

        // tweets[X].user.id_str || tweets[X].user.id
        // tweets[X].user.profile_background_image_url || tweets[X].user.profile_background_image_url_https
        // tweets[X].user.profile_image_url || tweets[X].user.profile_image_url_https
        // tweets[X].user.name
        // tweets[X].user.screen_name
      }
    }).then(function(){
      res.render('index');
    })
  // }

  // // TODO: This should be triggered by the users search with the search field value as param
  // tweetFinder('#pony');

});

app.listen(3000, () => {
  console.log("The application is running on localhost:3000!");
});
