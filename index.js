const express = require('express')
const passport = require('passport')
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

require('./passport')(passport)

app.get('/', (req, res)=>{
    console.log(req.user)
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
    
    return res.render('register.ejs', {error: error})
})

app.get('/login', function(req, res){
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local',{ failureRedirect:'/login', successRedirect:'/' }))

app.listen(3000, (err)=>{
    if(!err){
        console.log("Listening at 3000")
    }
});