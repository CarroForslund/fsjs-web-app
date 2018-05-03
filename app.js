'use strict';
const express = require('express');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const passport = require('passport');
// const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
// const User = require('./models/user');

// Twitter
const Twit = require('twit');
const config = require('./config/twitter-config');
const T = new Twit(config);

// Get Hashtag results from Twitter
// filter the public stream by english tweets containing `#apple`
var stream = T.stream('statuses/filter', { track: '#apple ', language: 'en' })

stream.on('tweet', function (tweet) {
  console.log(tweet)
})

// Get Hashtag results from Instagram

const app = express();

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log("The application is running on localhost:3000!");
});
