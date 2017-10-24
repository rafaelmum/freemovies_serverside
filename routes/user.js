var mongoose = require( 'mongoose' );
var User = require('../models/user');
var jwt = require('jsonwebtoken'); 
var config = require('../config');

exports.signup = function(req, res, next){
   // Check for registration errors
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    if (!firstname || !lastname || !email || !username || !password) {
        return res.status(422).json({ success: false, message: 'Posted data is not correct or incomplete.'});
    }

    User.findOne({ username: username }, function(err, existingUser) {
        if(err){ res.status(400).json({ success: false, message:'Error processing request '+ err}); }

        // If user is not unique, return error
        if (existingUser) {
            return res.status(201).json({
                success: false,
		message: 'Username already exists.'
            });
        }

        // If no error, create account
        let oUser = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            username: username,
            password: password
        });

        oUser.save(function(err, oUser) {
            if(err){ res.status(400).json({ success: false, message:'Error processing request '+ err}); }
        
            res.status(201).json({
                success: true,
		message: 'User created successfully, please login to access your account.'
            });
        });
    });
}

exports.login = function(req, res, next){
    // find the user
    User.findOne({ username: req.body.username }, function(err, user) {
		if(err){ res.status(400).json({ success: false, message:'Error processing request '+ err}); }

		if (!user) {
			res.status(201).json({ success: false, message: 'Incorrect login credentials.' });
		}else if (user) {
			user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.sign(user, config.secret, {
			expiresIn: config.tokenexp
		    });
                    
                    let last_login = user.lastlogin;
                    
                    // login success update last login
                    user.lastlogin = new Date();
                
                    
                    user.save(function(err) {
                        if(err){ res.status(400).json({ success: false, message:'Error processing request '+ err}); }

                        res.status(201).json({
                            success: true,
                            message: {'userid': user._id, 'username': user.username, 'firstname': user.firstname, 'lastlogin': last_login},
                            token: token
                        });
                    });
                } else {
                    res.status(201).json({ success: false, message: 'Incorrect login credentials.' });
                }
            });	
		}
	});
}

exports.authenticate = function(req, res, next){
    // check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['authorization'];
    //console.log(token);
	if (token) {
		jwt.verify(token, config.secret, function(err, decoded) {			
			if (err) {
				return res.status(201).json({ success: false, message: 'Authenticate token expired, please login again.', errcode: 'exp-token' });		
			} else {
				req.decoded = decoded;	
				next();
			}
		});
	} else {
		return res.status(201).json({ 
			success: false, 
			message: 'Fatal error, Authenticate token not available.',
            		errcode: 'no-token'
		});
	}
}

