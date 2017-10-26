var express = require('express');
var mongoose = require('mongoose');

var User = require('../models/user');

var router = express.Router();

//mongoose.connect('mongodb://localhost/freemovies');

/* GET userprofile. */
router.get('/:username', function(req, res, next) {
  let user;
  let movieGivenArray;
  let movieReceivedArray;
  let userprofile;

  User.findOne({username: req.params.username}, function(err, userReturned) {
    if (err) {
      return console.error(err);
    }

    //user = userReturned;
    userprofile.user = userReturned;
  });

  Movie.findOne({username: req.params.username}, function(err, moviesReturned) {
    if (err) {
      return console.error(err);
    }

    //movieGivenArray = moviesReturned;
    userprofile.movieGivenArray = moviesReturned;
  });

  Movie.findOne({username: req.params.username}, function(err, moviesReturned) {
    if (err) {
      return console.error(err);
    }

    //movieReceivedArray = moviesReturned;
    userprofile.movieReceivedArray = moviesReturned;
  });

  /*
  userprofile.user = user;
  userprofile.movieGivenArray = movieGivenArray;
  userprofile.movieReceivedArray = movieReceivedArray;
  */

  res.end(JSON.stringify(userprofile));
});

module.exports = router;