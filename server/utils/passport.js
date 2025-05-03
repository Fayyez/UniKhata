import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import LocalStrategy from 'passport-local';
import JWTStrategy from 'passport-jwt';
import bcrypt from 'bcryptjs';
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
    //TODO: set these up in .env
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
                    email: profile.emails[0].value,
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
            const user = await User.findOne({ email });
            // if user not found
            if (!user) return done(null, false, { message: 'Invalid credentials' });
            // match encrypted password
            const isMatch = await bcrypt.compare(password, user.password);
            // if password doesnt match
            if (!isMatch) return done(null, false, { message: 'Invalid credentials' });
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
