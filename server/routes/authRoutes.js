import express from "express";
import passport from "passport";
import { generateTokens, refreshAccessToken } from "../utils/token.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import sendEmail from "../utils/mailer.js";

const router = express.Router();

// Google login route
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    //{
    // "accesstoken": abvc
    // "refreshtoken": abcs
    //}
    const {accessToken, refreshToken} = generateTokens(req.user);

    try {
      sendEmail(req.user.email, "Welcome To UniKhata - Your One Stop Ledger Management System", "You have successfully registered! Thank you for choosing UniKhata. We are excited to have you on board!");
    } catch (error) {
      console.error('Error sending email:', error);
    }
    // Redirect to frontend with tokens as URL parameters
    res.redirect(
      `http://localhost:5173/dashboard?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }
);

// Manual login route
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const tokens = generateTokens(req.user);
    //res.redirect(`http://localhost:5173/landing?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    res.json({ message: 'Login successful', tokens });
  }
);

// Register route for new users
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password, name });
    await newUser.save();

    const tokens = generateTokens(newUser);
    try {
      sendEmail(email, "Welcome To UniKhata - Your One Stop Ledger Management System", "You have successfully registered! Thank you for choosing UniKhata. We are excited to have you on board!");
    } catch (error) {
      console.error('Error sending email:', error);
    }
    res.status(201).json({ message: 'User created successfully', tokens });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// Refresh token route
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const newAccessToken = refreshAccessToken(refreshToken);
    res.json({ message: 'Token refreshed successfully', accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

// Add this new route before the export
router.get(
  "/user-info",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // TODO: fetch user data from database instead of directly sending
    console.log("user-info", req.user);
    res.json({
        message: 'User info fetched successfully',
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        // picture: req.user.picture
    });
  }
);

export default router;
