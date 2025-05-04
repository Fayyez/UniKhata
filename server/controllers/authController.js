import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token.js";
import {config} from 'dotenv';
import User from "../models/User.js";

config();
const PORT = process.env.BACKEND_PORT;

export const register = async (req, res) => {
    const { email, password, name } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name });
    const token = generateToken(user);
    res.json({ token });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    res.json({ token });
    };

    export const googleOAuthCallback = async (req, res) => {
    const user = req.user;
    const token = generateToken(user);
    console.log("user created successfully...");
    // Store tokens in localStorage through URL parameters
    res.redirect(`http://localhost:5173/landing?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
};
