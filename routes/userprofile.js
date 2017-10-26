var express = require('express');
var mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var User = require('../models/user');

var router = express.Router();

var url = 'mongodb://127.0.0.1/rentmovie';

/* GET user. */
router.get('/user/:username', function(req, res, next) {
  User.findOne({username: req.params.username}, function(err, userReturned) {
    if (err) {
      return console.error(err);
    }

    res.end(JSON.stringify(userReturned));
  });
});

/* GET movie given. */
router.get('/movieGiven/:username', function(req, res, next) {
  var resultArray = [];

  MongoClient.connect(url).then((db)=> {
    let data = db.collection('movies').find({owner: req.params.username});
    data.forEach(function(doc, err){
      resultArray.push(doc);
    }, function(){
      res.send(resultArray);
      db.close();
    })
  }).catch((err)=> {
      console.log(err.message);
  });
});

/* GET movie received. */
router.get('/movieReceived/:username', function(req, res, next) {
  var resultArray = [];

  MongoClient.connect(url).then((db)=> {
    let data = db.collection('movies').find({newowner: req.params.username});
    data.forEach(function(doc, err){
      resultArray.push(doc);
    }, function(){
      res.send(resultArray);
      db.close();
    })
  }).catch((err)=> {
      console.log(err.message);
  });
});

/* Update users points. */
router.get('/updatepoints/:username/:movieid', function(req, res, next) {
  var resultArray = [];
  
  // Find movie.
  MongoClient.connect(url).then((db)=> {
    let data = db.collection('movies').find({_id: ObjectId(req.params.movieid)});
    data.forEach(function(doc, err){
      resultArray.push(doc);
    }, function(){
      let pointsUpdated;
      
      // Find user who posted the movie.
      User.findOne({username: resultArray[0].owner}, function(err, userReturned) {
        if (err) {
          return console.error(err);
        }
    
        pointsUpdated = userReturned.points != null && userReturned.points != undefined ? userReturned.points + 10 : 10;

        userReturned.points = pointsUpdated;

        // Update points of user who posted the movie.
        User.findOneAndUpdate({username: resultArray[0].owner}, userReturned, function(err, userUpdated) {
          if (err) {
            return console.error(err);
          }

          // Find user who got the movie.
          User.findOne({username: req.params.username}, function(err, userReturned2) {
            if (err) {
              return console.error(err);
            }

            pointsUpdated = userReturned2.points != null && userReturned2.points != undefined ? userReturned2.points - 10 : -10;

            userReturned2.points = pointsUpdated;

            // Update points of user who got the movie.
            User.findOneAndUpdate({username: req.params.username}, userReturned2, function(err, userUpdated2) {
              if (err) {
                return console.error(err);
              }
            });
          });
        });
      });

      db.close();
    });
  }).catch((err)=> {
      console.log(err.message);
  });
});

module.exports = router;