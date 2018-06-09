'use strict';
const express           = require('express');
const path              = require('path');
const logger            = require('morgan');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const mongoose          = require('mongoose');
const passport          = require('passport');
// const GitHubStrategy    = require('passport-github').Strategy;
const FacebookStrategy  = require('passport-facebook').Strategy;
const session           = require('express-session');
const MongoStore        = require('connect-mongo')(session);
const User              = require('./models/user');
const config            = require('./config/config');

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

// passport.use(new GitHubStrategy({
//     clientID: config.github.client_id,
//     clientSecret: config.github.client_secret,
//     callbackURL: config.github.callback_url
//   },
//   generateOrFindUser)
// );

passport.use(new FacebookStrategy({
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

// ACCESS ROUTES ===============================================================
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

// ERROR HANDLERS ==============================================================

// Development error handler (will print stacktrace)
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler (no stacktraces leaked to user)
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// EXPORT APP ==================================================================
module.exports = app;
