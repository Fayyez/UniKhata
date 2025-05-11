import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import passport from 'passport';
import session from 'express-session';
import mongoose from 'mongoose';
import cors from 'cors';

// importing all the routes
import authRoutes from './routes/authRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import logger from './utils/logger.js';
import mailRoutes from './routes/mailRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

// connectiing to the database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('\x1b[33m>> Connected to MongoDB\x1b[0m\n'))
    .catch(err => console.log(err));

import './utils/passport.js'

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes 

// TODO: add auth middleware to all the routes
app.use('/api/auth', authRoutes);// for authentication service
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mail', mailRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`\x1b[32m>> Server Running On Port '${PORT}'\x1b[0m`));
