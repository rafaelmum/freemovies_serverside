var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
//Set up default mongoose connection
var url = 'mongodb://127.0.0.1/rentmovie'; 


/* GET home page. */
router.get('/', function(req, res, next) {
 
  res.json({"foo": "bar"});
  
  
});
router.post('/add', function(req, res, next) {    
   var movie={
     title:req.body.title,
     year: req.body.year,
     duration: req.body.duration,
     owner: req.body.owner,
     newowner: ''
   }
   MongoClient.connect(url).then((db)=> {
    db.collection('movies').insertOne(movie, function(err, result){
    console.log('inserted');
    db.close();
    });

  }).catch((err)=> {
    console.log(err.message);
    });
   
 });


 router.get('/delete', function(req, res, next) {  
  
  MongoClient.connect(url).then((db)=> {
   db.collection('movies').deleteOne({"_id":ObjectId("59efc46a97dc5fc69671b582")}, function(err, result){
   console.log('data deleted');
   db.close();
   });

 }).catch((err)=> {
   console.log(err.message);
   });
  
});
router.get('/update/:name/:id',function(req, res, next) {

  console.log(req.params.id + "  "+ req.params.name);
  MongoClient.connect(url).then((db)=> {
   
    db.collection('movies').update(
      {_id: ObjectId(req.params.id) },
      {$set: {newowner:req.params.name} }
   );
   var resultArray= [];
   var data=db.collection('movies').find();
   data.forEach(function(doc, err){
     resultArray.push(doc);
     
   }, function(){
     res.send(resultArray);
     db.close();
   });


    }).catch((err)=> {
    console.log(err.message);
    });

});
router.get('/movies', function(req, res, next) {
  var resultArray= [];

  MongoClient.connect(url).then((db)=> {
    var data=db.collection('movies').find();
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
router.get('/movies/:title', function(req, res, next) {
    var resultArray= [];

  MongoClient.connect(url).then((db)=> {
    var data=db.collection('movies').find({title: req.params.title});
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
