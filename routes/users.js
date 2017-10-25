var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/test' ;
/* GET users listing. */
router.get('/', function(req, res, next) {
  MongoClient.connect(url).then((db)=> {
    console.log("connected successfully");
    db.close();
  }).catch((err)=> {
    console.log(err.message);
  }

  );
});

module.exports = router;
