var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose    = require('mongoose');
//Import the mongoose module
var jwt    = require('jsonwebtoken');
var config = require('./config');


var user = require('./routes/user.js');

mongoose.connect(config.database, function(err){
	if(err){
		console.log('Error connecting database, please check if MongoDB is running.');
	}else{
		console.log('Connected to database...');
	}
});



var index = require('./routes/index');
var users = require('./routes/users');
var movie = require('./routes/movie');
var port= 3001;
var userprofile = require('./routes/userprofile');

var app = express();
// used morgan to log requests to the console
//app.use(morgan('dev'));
// Add headers
app.use(function (req, res, next) {
  
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');
  
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);
  
      // Pass to next layer of middleware
      next();
  });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());

//app.use(bodyParser.urlencoded({ extended: false }));
// used body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('body-parser').json({ type : '*/*' }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/register', user.signup);
app.use('/', index);
app.use('/users', users);
app.use('/movie', movie);
app.use('/userprofile', userprofile);


// express router
var apiRoutes = express.Router();

app.use('/api', apiRoutes);

apiRoutes.post('/login', user.login);

apiRoutes.use(user.authenticate); // route middleware to authenticate and check token


// authenticated routes
apiRoutes.get('/', function(req, res) {
	res.status(201).json({ message: 'Welcome to the authenticated routes!' });
});


apiRoutes.get('/user/:id', user.getuserDetails); // API returns user details
apiRoutes.put('/user/:id', user.updateUser); // API updates user details

apiRoutes.put('/password/:id', user.updatePassword); // API updates user password





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, function(){
  console.log('Server on port running ' + port);
});

module.exports = app;
