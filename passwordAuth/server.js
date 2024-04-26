require('dotenv').config();
const express = require('express'), app = express();
const bcrypt = require('bcrypt');// for hashing passwords and comparing hashed passwords
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const port = process.env.PORT || 8080;
const initializePassport = require('./passport-config');
initializePassport(
    passport, 
    email => users.find(user => user.email === email), 
    id => users.find(user => user.id === id)
    );

//Data
const users =[]

//middleware
app.set('view-engine','ejs'); //to use ejs
app.use(express.urlencoded({extended:false})); //to be able to use our forms
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // means should we resave session variables if nothing change: false
    saveUninitialized: false // do you want to save empty value in a session if there is no value
}));
app.use(passport.initialize());
app.use(passport.session()); // to store variables to be consistent across entire session
app.use(methodOverride('_method'));


//api
app.get('/' ,checkAuthenticated ,(req,res)=>{
    //send page we want to redner when login successful
    res.render('index.ejs', {name: req.user.name});
});

app.get('/login',checkNotAuthenticated,(req,res)=>{
    res.render('login.ejs')
});
app.post('/login',checkNotAuthenticated ,passport.authenticate('local',{
    //where do we go if login success
    successRedirect: '/',
    //where do we go if login fails
    failureRedirect: '/login',
    failureFlash: true // flash message to display to user
}));

app.get('/register',checkNotAuthenticated,(req,res)=>{
    res.render('register.ejs')
});
app.post('/register',checkNotAuthenticated,async (req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword 
        })
        res.redirect('/login')//take them to this page
        console.log('registration successful');
    }catch {
        res.redirect('/register')
        console.log('registration failed');
    }
    console.log(users);
});

app.delete('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {
            // Handle any potential errors during logout
            console.error(err);
            return next(err); // You can also use a custom error handler
        }
        res.redirect('/login');
    });
});


function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}
function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next();
}

//server
app.listen(port, ()=>{
    console.log(`server listening on port: ${port}`)
});