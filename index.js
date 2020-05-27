const express = require('express')
const passport = require('passport')
const google = require('passport-google-oauth20').Strategy
const path = require('path')
const cookie = require('cookie-session')
const https = require('https')
const fs = require('fs')
const httpsLocalhost = require('https-localhost')()

// Including Key and Certificate
// const key = fs.readFileSync('./server.key');
// const cert = fs.readFileSync('./server.crt');


const app = express()
app.set('views', path.join(__dirname, '/views') )
app.use(passport.initialize())
app.use(passport.session())
app.use(cookie({
    name:'tuto',
    keys:['key1', 'key2']
}))

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
    console.log('Reached Here')
    console.log(profile);
    return done(null, profile)
}))

app.get('/', (req, res)=>{
    console.log("Rohanraj")
    res.render('index.ejs')
})

app.get('/auth/google', passport.authenticate('google', {scope:['email', 'https://www.google.com/m8/feeds', 'profile']}))

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect:'/'}), function(req, res){
    res.redirect('/')
})


const certs = httpsLocalhost.getCerts()
const server = https.createServer(certs, app)
server.listen(3000)
// app.listen(3000, (err)=>{
//     if(!err){
//         console.log("Listening at 3000")
//     }
// });
