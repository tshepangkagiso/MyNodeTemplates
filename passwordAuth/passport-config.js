const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy


function initialize(passport, getUserByEmail, getUserByID){
    const authenticateUser = async (email, password, done) =>{
        const user = getUserByEmail(email)
        if(user == null){
            return done(null,false, {message: 'no user match that email'})//failureflash
        }

        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null,user)
            }else{
                return done(null,false, {message: 'Password Incorrect'})//failureflash
            }
        }catch(e){
            done(e)
        }
    }
    passport.use(new LocalStrategy( {usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user,done) => done(null,user.id))
    passport.deserializeUser((id,done) => done(null, getUserByID(id)) );
}

module.exports = initialize