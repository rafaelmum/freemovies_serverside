var mongoose = require( 'mongoose' );
var jwt = require('jsonwebtoken'); 
var config = require('../config');



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
