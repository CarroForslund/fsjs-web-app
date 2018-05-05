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

// TODO: Move this function to the right place
// Get Hashtag results from Twitter
function tweetFinder(hashtag){
  T.get('search/tweets', { q: hashtag + ' since:2017-01-01', count: 20, lang: 'en' }, function(err, data, response) {
    if(err){
      // TODO: Make sure to throw a proper Error
      console.log("An error occured", err);
    }
    else {
      // TODO: Make sure the right values are being saved
      console.log("Tweet 1", data.statuses[0].text);
      console.log("Tweet 2", data.statuses[1].text);
      console.log("Tweet 3", data.statuses[2].text);
    }
  })
}

// TODO: This should be triggered by the users search with the search field value as param
tweetFinder('#pony');


// Get Hashtag results from Instagram


const app = express();

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log("The application is running on localhost:3000!");
});
