const express = require('express')
const passport = require('passport')
const google = require('passport-google-oauth20').Strategy
const path = require('path')
const cookie = require('cookie-session')
const layout = require('express-ejs-layouts')
const User = require('./models/user')
const parser = require('body-parser')
// Including Key and Certificate
// const key = fs.readFileSync('./server.key');
// const cert = fs.readFileSync('./server.crt');

require('./mongodb')
const app = express()
app.set('views', path.join(__dirname, '/views') )
app.use(passport.initialize())
app.use(passport.session())
app.use(cookie({
    name:'tuto',
    keys:['key1', 'key2']
}))
app.use(layout)
app.use(parser.urlencoded(
    {extended: true}
))
app.set('view engine', 'ejs')

// const server = https.createServer({key: key, cert: cert }, app);
passport.serializeUser(function(user, done) {
    return done(null, user.id);
});
  
passport.deserializeUser(function(user, done) {
    return done(null, user)
});

passport.use(new google({
    clientID:"602939967550-715p9modvd1fu3rengcdqd2djnmrr7l0.apps.googleusercontent.com",
    clientSecret:"YXD7ROlvVcEJVds3VnOBrMZt",
    callbackURL: "https://8f121d3f.ngrok.io/auth/google/callback" // To have a secure connection
}, function(token, tokenSecret, profile, done) {
    console.log(profile);
    return done(null, profile)
}))

app.get('/', (req, res)=>{
    res.render('index.ejs')
})

app.get('/auth/google', passport.authenticate('google', {scope:['email', 'https://www.google.com/m8/feeds', 'profile']}))

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect:'/'}), function(req, res){
    res.redirect('/')
})

app.get('/register', function(req, res){
    res.render('register.ejs')
})

app.post('/register', function(req, res){
    var error = ""
    const {name, email, password, password2} = req.body
    if (name.length==0 || email.length==0 || password.length ==0 || password2. length==0){
        error = "PLease fill all Fields"
    }
    if(password!=password2){
        error="Passwords are not same please try again!!"
    }
    else{
        User.findOne({'email': email}, function(err, user){
            if(err){
                console.log(err)
            }
            else if(user){
                error = "User Already Exists"
            }
            else{
                var newUser = new User()
                newUser.email = email
                newUser.name = name
                newUser.password = password

                newUser.save(function (err) {
                    if(!err){
                        console.log('User Added Successfully')
                    }
                    else{
                        console.log(err)
                    }
                })
            }
        })
    }
    
    return res.render('register.ejs', {error: error, msg: message})
})

app.get('/login', function(req, res){
    res.render('login.ejs')
})

app.listen(3000, (err)=>{
    if(!err){
        console.log("Listening at 3000")
    }
});