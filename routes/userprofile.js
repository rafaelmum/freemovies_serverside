var express = require('express');
var mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

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
  var resultArray= [];

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
  var resultArray= [];

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

module.exports = router;