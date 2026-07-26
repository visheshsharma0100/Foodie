import express from "express";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import Users from "../Models/Users.js";
import connectDb from "../Models/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;

// One-time setup route. Set ADMIN_SETUP_KEY in .env before using it.
router.post("/bootstrap-admin", async (req, res) => {
    try {
        await connectDb();
        const { setupKey, name, email, password } = req.body;
        if (!process.env.ADMIN_SETUP_KEY || setupKey !== process.env.ADMIN_SETUP_KEY) {
            return res.status(403).json({ message: "Invalid admin setup key." });
        }
        if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
            return res.status(400).json({ message: "Name, email, and a password of at least 8 characters are required." });
        }
        if (await Users.exists({ role: "admin" })) {
            return res.status(409).json({ message: "An admin account already exists." });
        }
        if (await Users.exists({ email: email.trim().toLowerCase() })) {
            return res.status(409).json({ message: "A user with this email already exists." });
        }
        const admin = await Users.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: await bcrypt.hash(password, 10),
            role: "admin",
        });
        return res.status(201).json({ message: "Admin account created.", admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
    } catch (error) {
        return res.status(500).json({ message: "Unable to create the admin account." });
    }
});

// Register
router.post("/register", async (req, res) => {
    try {
        console.log("[auth-register] received request", req.body?.email);
        await connectDb();
        const { name, email, password } = req.body;

        if (!name?.trim() || !email?.trim() || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        // Check if user already exists
        const userExist = await Users.findOne({ email: email.trim().toLowerCase() });

        if (userExist) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new Users({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            message: "New user created successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });

    } catch (error) {
        console.error("[auth-register] failed", error);
        return res.status(500).json({
            message: error.message,
        });
    }
});


// login route

router.post("/login", async (req, res) => {
    try {
        console.log("[auth-login] received request", req.body?.email);
        await connectDb();
        const { email, password } = req.body;

        if (!email?.trim() || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const userExists = await Users.findOne({ email: email.trim().toLowerCase() });
        if (!userExists) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const isMatch = await bcrypt.compare(password, userExists.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password",
            });
        }

        const token = jwt.sign(
            {
                id: userExists._id,
                role: userExists.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: userExists._id,
                name: userExists.name,
                email: userExists.email,
                role: userExists.role,
            },
        });
    }
    catch(error){
        console.error("[auth-login] failed", error);
        return res.status(500).json({
            message:error.message
        });
    }
});

router.post("/google", async (req, res) => {
    try {
        await connectDb();
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: "Google credential is required." });
        }

        if (!googleClient || !process.env.GOOGLE_CLIENT_ID) {
            return res.status(503).json({ message: "Google authentication is not configured yet." });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload?.email?.trim().toLowerCase();
        const name = payload?.name || payload?.given_name || "Google User";

        if (!email) {
            return res.status(400).json({ message: "Google account email is required." });
        }

        let user = await Users.findOne({ email });
        if (!user) {
            user = await Users.create({
                name,
                email,
                password: await bcrypt.hash(randomUUID(), 10),
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.status(200).json({
            message: "Google login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("[auth-google] failed", error);
        return res.status(500).json({ message: error.message || "Google authentication failed." });
    }
});

export default router;
