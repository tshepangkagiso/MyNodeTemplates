const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const sql = require('mssql/msnodesqlv8');
const { connectToDB, closeDB } = require('./database/dbConfig');

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        try {
            await connectToDB();
            const query = `
                SELECT userID, userName, userPassword FROM UserDetails WHERE userEmail = @Email`;

            const request = new sql.Request();
            request.input('Email', sql.VarChar(200), email);

            const result = await request.query(query);
            const user = result.recordset[0];

            if (!user) {
                return done(null, false, { message: 'No user matches that email' });
            }

            try {
                if (await bcrypt.compare(password, user.userPassword)) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password Incorrect' });
                }
            } catch (error) {
                return done(error);
            }
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'An error occurred while creating the user' });
        } finally {
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

module.exports = initialize;
