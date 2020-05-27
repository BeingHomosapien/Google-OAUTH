const google = require('passport-google-oauth20').Strategy
const local = require('passport-local').Strategy
const User = require('./models/user')
module.exports = function(passport){
    passport.serializeUser(function(user, done) {
        return done(null, user.id);
    });
      
    passport.deserializeUser(function(user, done) {
        return done(null, user)
    });
    
    passport.use(new local({
        usernameField: 'email',
        passwordField: 'password'
    }, function(username, password, done){
        User.findOne({'email': username}, function(err, user){
            if(err){
                console.log(err)
            }
            else if(user){
                if (password==user.password){
                    return done(null, user)
                }
                else{
                    console.log("Failed")
                    return done(null, false)
                }
            }
            else{
                console.log("Failed")
                return done(null, false) // false is to tell tthat the authentication failed
            }
        })
    }))

    passport.use(new google({
        clientID:"602939967550-715p9modvd1fu3rengcdqd2djnmrr7l0.apps.googleusercontent.com",
        clientSecret:"YXD7ROlvVcEJVds3VnOBrMZt",
        callbackURL: "https://8f121d3f.ngrok.io/auth/google/callback" // To have a secure connection
    }, function(token, tokenSecret, profile, done) {
        console.log(profile);
        return done(null, profile)
    }))
}