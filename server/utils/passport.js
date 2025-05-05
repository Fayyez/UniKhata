import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import LocalStrategy from 'passport-local';
import JWTStrategy from 'passport-jwt';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err));
});

// Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {// if user not already created
                user = new User({
                    googleId: profile.id,
                    email: profile.emails[0].value.toLowerCase(),
                    name: profile.displayName,
                    avatar: profile.photos[0].value,
                });
                // create or save new user
                await user.save();
            }

            done(null, user);
        } catch (err) {
            done(err);
        }
    })
);

// Local strategy for manual login
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
},
    async (email, password, done) => {
        try {
            // find user in the database
            email = email.toLowerCase();
            const user = await User.findOne({ email });
            // if user not found
            if (!user) {
                console.log("user not found by local strategy");
                
                return done(null, false, { message: 'user not found' });
            }
            // match encrypted password
            console.log(password, user.password);
            
            const isMatch = password === user.password;
            // if password doesnt match
            if (!isMatch) {
                console.log(" invalid cred by local strategy");
                
                return done(null, false, { message: 'Invalid credentials' });
            }
            // return user
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

// JWT Strategy
const options = {
    jwtFromRequest: JWTStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JWTStrategy.Strategy(options, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));
