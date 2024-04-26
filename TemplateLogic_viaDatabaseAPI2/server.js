require('dotenv').config();

//DEPENDENCIES
const express = require('express');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const cors = require('cors');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const ejs = require('ejs');

const initializePassport = require('./passport-config');
const { checkAuthenticated, checkNotAuthenticated } = require('./middleware');
const { connectToDB, closeDB } = require('./database/dbConfig');
const port = process.env.PORT || 8080;


//MIDDLEWARE
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(cors());
// Set Content Security Policy in your Express app,to reduce xss attacks
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
    /*Avoid eval() and innerHTML: Avoid using eval() and setting innerHTML directly with user input. These can be vulnerable to XSS. */ 
    /*Implement a CSP header that specifies which sources of content are allowed to be loaded by a web page. This can help mitigate the impact of XSS attacks.*/ 
});
// Add the CSRF token to your template context
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
    /*CSRF attacks occur when a malicious website tricks a user's browser into making an unintended request to another site where the user is authenticated. To prevent CSRF attacks:*/
  // Handle CSRF errors
  });
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      res.status(403).send('CSRF Token Invalid');
    } else {
      next(err);
    }
    /*Implement CSRF tokens in your forms. When generating forms, include a unique token as a hidden field. On form submission, verify that the token matches the one generated for the user's session.*/
});
// When setting a cookie in Express.js
//res.cookie('session', 'your-session-data', { httpOnly: true });
/*HTTP-Only Cookies: Set cookies as HTTP-only to prevent JavaScript from accessing them. This can help protect sensitive session data.*/

// API ROUTES
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const mainRouter = require('./routes/logout');

app.use('/', logoutRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);


//server
app.listen(port, ()=>{
    console.log(`server listening on port: ${port}`)
}); 
