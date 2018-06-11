const express = require('express');
const router = express.Router();
const passport = require('passport');

// GET /auth/login/github
router.get('/login/github',
  passport.authenticate('github'));

// GET /auth/github/return
router.get('/github/return',
  passport.authenticate('github', {failureRedirect: '/'}),
  function(req, res){
    //Success Auth, redirect profile page
    res.redirect('/profile');
  });

// GET /auth/login/facebook
router.get('/login/facebook',
  passport.authenticate('facebook', {scope: ["email"]}));

// GET /auth/facebook/return
router.get('/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

/// GET /auth/logout
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


module.exports = router;
