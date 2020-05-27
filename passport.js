const google = require('passport-google-oauth20').Strategy
const local = require('passport-local').Strategy
const User = require('./models/user')
const GoogleUser = require('./models/google')

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
                return done(err)
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
        GoogleUser.findOne({'id':profile.id}, function(err, user){
            if(err){
                console.log(err)
                return done(err)
            }
            else if(user){
                return done(null,user)
            }
            else{
                var newUser = new GoogleUser()
                newUser.id = profile.id
                newUser.email = profile.emails[0].value()
                newUser.name = profile.name.givenName + " " + profile.name.middleName + " " + profile.name.familyName

                newUser.save(function(err){
                    if(!err){
                        console.log("Added Successfully!!")
                    }
                    else{
                        console.log("Error" + err)
                    }
                })
            }
        })
    }))
}