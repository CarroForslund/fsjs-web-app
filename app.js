'use strict';
const express           = require('express');
const path              = require('path');
const logger            = require('morgan');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const mongoose          = require('mongoose');
const passport          = require('passport');
const GitHubStrategy    = require('passport-github').Strategy;
const FacebookStrategy  = require('passport-facebook').Strategy;
const session           = require('express-session');
const MongoStore        = require('connect-mongo')(session);
const User              = require('./models/user');
const config            = require('./config/config');

// npm WARN bootstrap@4.1.1 requires a peer of jquery@1.9.1 - 3 but none is installed. You must install peer dependencies yourself.
// npm WARN bootstrap@4.1.1 requires a peer of popper.js@^1.14.3 but none is installed. You must install peer dependencies yourself.

// CONFIGURE LOGIN STRATEGIES ==================================================
function generateOrFindUser(accessToken, refreshToken, profile, done){
  if(profile.emails[0]) {
    User.findOneAndUpdate(
      { email: profile.emails[0] },
      {
        name: profile.displayName || profile.username,
        email: profile.emails[0].value,
        photo: profile.photos[0].value
      },
      {
        upsert: true
      },
    done
  );
  } else {
    var noEmailError = new Error("Your email privacy settings prevent you from signing into Bookworm.");
    done(noEmailError, null);
  }
}

passport.use(new GitHubStrategy({
    // clientID: process.env.GITHUB_CLIENT_ID,
    // clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // callbackURL: 'http://localhost:3000/auth/github/return'
    clientID: config.github.client_id,
    clientSecret: config.github.client_secret,
    callbackURL: config.github.callback_url
  },
  generateOrFindUser)
);

passport.use(new FacebookStrategy({
  // clientID: process.env.FACEBOOK_APP_ID,
  // clientSecret: process.env.FACEBOOK_APP_SECRET,
  // callbackURL: "http://localhost:3000/auth/facebook/return",
  // profileFields: ['id', 'displayName', 'photos', 'email']
  clientID: config.facebook.app_id,
  clientSecret: config.facebook.app_secret,
  callbackURL: config.facebook.callback_url,
  profileFields: config.facebook.profile_fields
},
  generateOrFindUser)
);

passport.serializeUser(function(user, done){
  done(null, user._id); //null for error
});

passport.deserializeUser(function(userId, done){
  User.findById(userId, done);
});

// ACCESS TWITTER (move?!?)
// const Twit = require('twit');
// const twitterConfig = require('./config/twitter-config');
// const T = new Twit(twitterConfig);

// const morgan = require('morgan'); //morgan is an http request logger middleware for Node.js
// const mongoose = require('mongoose'); //mongoose is an object modeling tool for MongoDB

// const config = require('./config/config');
// const authUser = require('./services/insta-auth');
const routes = require('./routes/index');
const auth = require('./routes/auth');

const app = express();

// VIEW ENGINE SETUP ===========================================================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// const instagram = require('./config/instagram-config');
// const authUser = require('./services/insta-auth');

// Get Hashtag results from Instagram
// TODO: AJAX call to https://api.instagram.com/v1/tags/{tag-name}/media/recent?access_token=ACCESS-TOKEN

// MONGO DB CONNECTION =========================================================
mongoose.connect("mongodb://localhost:27017/hashtag-finder");
const db = mongoose.connection;

// SESSION CONFIG FOR Passport and MongoDB
const sessionOptions = {
  secret: "super secret string",
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: db
  })
};

app.use(session(sessionOptions));

// INITIALIZE Passport.js
app.use(passport.initialize());

// RESTORE Session
app.use(passport.session());

// MONGO ERROR
db.on('error', console.error.bind(console, 'connection error:'));

app.use('/', routes);
app.use('/auth', auth);

// CATCH 404 AND FORWARD TO ERROR HANDLER ======================================
app.use(function(req, res, next) {
  var err = new Error('File not Found');
  err.status = 404;
  next(err);
});

// ERROR HANDLERS

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});












// app.use(morgan('dev'));

// app.use(express.static(__dirname + '/public'));
//
// app.get('/', function (request, response) {
// 	response.sendfile('./public/index.html')
// });

// // app.get('/auth', authUser);
//
// app.get('/auth', function (req, res) {
// 	res.send(req.query.code);
// });
//
// app.get('/login', function (req, res) {
// 	res.redirect(config.instagram.auth_url);
// });

// app.get('/', (req, res) => {
//
//   // Get Hashtag results from Twitter ==========================================
//   // TODO: Move this function to the right place
//   // TODO: This should be triggered by the users search with the search field value as param
//   // function tweetFinder(hashtag){
//     // T.get('search/tweets', { q: hashtag + ' since:2017-01-01', count: 20, lang: 'en' }, function(err, data, response) {
//     T.get('search/tweets', { q: '#pony since:2017-01-01', count: 5, lang: 'en' }, function(err, data, response) {
//       if(err){
//         // TODO: Make sure to throw a proper Error
//         console.log("An error occured", err);
//       }
//       else {
//         // TODO: Make sure the right values are being saved
//         const tweets = data.statuses;
//         // console.log(tweets[0]);
//         res.locals.tweets = tweets;
//         // tweets[X].created_at
//         // tweets[X].text
//         // tweets[X].retweet_count
//         // tweets[X].favorite_count
//
//         // tweets[X].user.id_str || tweets[X].user.id
//         // tweets[X].user.profile_background_image_url || tweets[X].user.profile_background_image_url_https
//         // tweets[X].user.profile_image_url || tweets[X].user.profile_image_url_https
//         // tweets[X].user.name
//         // tweets[X].user.screen_name
//       }
//     }).then(function(){
//       res.render('index');
//     })
//   // }
//
//
// });

// app.listen(3000, () => {
//   console.log("The application is running on localhost:3000!");
// });

module.exports = app;
