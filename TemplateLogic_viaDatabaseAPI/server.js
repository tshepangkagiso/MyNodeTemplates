require('dotenv').config();


//Dependencies
const express = require('express'), app = express();
const bcrypt = require('bcrypt');// for hashing passwords and comparing hashed passwords
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const LocalStrategy = require('passport-local').Strategy;
const sql = require('mssql/msnodesqlv8');
const bodyParser = require('body-parser');
const cors = require('cors');
const{closeDB,connectToDB} = require('./database/dbConfig');

//Data structure and variables
const Users =[]
const port = process.env.PORT || 8080;


//Function Calling
initialize(passport,Users);


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
app.use(bodyParser.json());
app.use(cors());


//API LOGIC

app.get('/' ,checkAuthenticated ,(req,res)=>{
    //send page we want to redner when login successful
    const userName = Users[0].userName
    console.log(`username: ${userName}`)
    res.render('index.ejs', {name: userName});
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
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        await connectToDB(); // Connect to the database

        const password = await bcrypt.hash(req.body.password, 10); // Hash the password
        const name = req.body.name;
        const email = req.body.email;

        const request = new sql.Request();
        const query = `
            INSERT INTO UserDetails (userName, userEmail, userPassword)
            VALUES (@UserName, @UserEmail, @UserPassword)
        `;

        request.input('UserName', sql.VarChar(100), name);
        request.input('UserEmail', sql.VarChar(200), email);
        request.input('UserPassword', sql.VarChar(1000), password);

        try {
            const result = await request.query(query); // Execute the SQL query

            // Registration was successful
            res.redirect('/login'); // Redirect the user to the login page
            console.log('Registration successful');
        } catch (err) {
            // Handle any database-related errors
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'An error occurred while creating the user' });
        } finally {
            await closeDB(); // Close the database connection
        }
    } catch {
        // Handle any general errors
        res.redirect('/register');
        console.log('Registration failed');
    }
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


// Functions and Middleware Functions

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
function initialize(passport){
    const authenticateUser = async (email, password, done) => {
        try{
            await connectToDB();
            const query = `
                SELECT userID, userName, userPassword FROM UserDetails WHERE userEmail = @Email`;
        
            const request = new sql.Request();
            request.input('Email', sql.VarChar(200), email);
        
            const result = await request.query(query);
            const user = result.recordset[0];
            Users.push(user)
    
            if (!user) {
                return done(null, false, { message: 'No user matches that email' });
              }
              
          
              try {
                if (await bcrypt.compare(password,user.userPassword)) {
                  return done(null, user);
                } else {
                  return done(null, false, { message: 'Password Incorrect' });
                }
              } catch (error) {
                return done(error);
              }
        } catch (err) {
            // Handle any database-related errors
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'An error occurred while creating the user' });
        }
        finally{
            await closeDB();
        }
      }
  
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  
    passport.serializeUser((user, done) => {
      done(null, user.userID);
    });
  
    passport.deserializeUser((user, done) => {
      done(null, user);
    });
}

//server
app.listen(port, ()=>{
    console.log(`server listening on port: ${port}`)
}); 
