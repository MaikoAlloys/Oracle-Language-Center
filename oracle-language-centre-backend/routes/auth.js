const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
require("dotenv").config();

const router = express.Router();

// ✅ Student Registration (Requires Admin Approval)
router.post("/student/register", async (req, res) => {
    const { username, first_name, last_name, email, phone, password } = req.body;

    if (!username || !first_name || !last_name || !email || !phone || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) return res.status(500).json({ message: "Database error", error: err });

            if (results.length > 0) {
                return res.status(400).json({ message: "Email already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(
                "INSERT INTO users (username, first_name, last_name, email, phone, password, is_approved, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [username, first_name, last_name, email, phone, hashedPassword, false, "student"],
                (err, result) => {
                    if (err) return res.status(500).json({ message: "Database error", error: err });
                    res.status(201).json({ message: "Registration successful. Wait for admin approval." });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Student Login (Ensures Token is Returned)
router.post("/student/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
            if (err) return res.status(500).json({ message: "Database error", error: err });

            if (results.length === 0) {
                return res.status(400).json({ message: "User not found" });
            }

            const user = results[0];

            if (!user.is_approved) {
                return res.status(403).json({ message: "Your account is not approved yet. Please wait for admin approval." });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

            console.log("✅ Token Generated:", token);

            res.json({
                message: "Login successful",
                token,
                student: { id: user.id, username: user.username },
            });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Finance Manager Login with Hashed Password
router.post("/finance/login", (req, res) => {
    const { username, password } = req.body;

    console.log("🔹 Login Attempt for Finance:", username); // Debugging

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // ✅ Fetch Finance Manager by Username (Don't check password here)
    db.query("SELECT * FROM finance_managers WHERE username = ?", [username], async (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            console.warn("⚠️ Invalid Username or Password");
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const financeManager = results[0];

        // ✅ Compare Hashed Password
        const isMatch = await bcrypt.compare(password, financeManager.password);
        if (!isMatch) {
            console.warn("⚠️ Password Comparison Failed");
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { id: financeManager.id, role: "finance" }, 
            process.env.JWT_SECRET, 
            { expiresIn: "24h" }
        );

        console.log("✅ Finance Token Generated:", token); // Debugging

        res.json({ message: "✅ Login successful!", token, financeManager });
    });
});

// ✅ HOD Login API
router.post("/hod/login", (req, res) => {
    const { username, password } = req.body;

    console.log("🔹 Login Attempt for HOD:", username); // Debugging

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    db.query("SELECT * FROM hods WHERE username = ?", [username], async (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            console.warn("⚠️ Invalid Username or Password");
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const hod = results[0];

        // ✅ Verify Hashed Password
        const isMatch = await bcrypt.compare(password, hod.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { id: hod.id, role: "hod" },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        console.log("✅ HOD Token Generated:", token);

        res.json({ message: "✅ Login successful!", token, hod });
    });
});

// ✅ Tutor Login API
router.post("/tutors/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        db.query("SELECT * FROM tutors WHERE username = ?", [username], async (err, results) => {
            if (err) return res.status(500).json({ message: "Database error", error: err });

            if (results.length === 0) {
                return res.status(400).json({ message: "User not found" });
            }

            const tutor = results[0];

            const isMatch = await bcrypt.compare(password, tutor.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { id: tutor.id, role: "tutor" },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            console.log("✅ Token Generated:", token);

            res.json({
                message: "Login successful",
                token,
                tutor: { id: tutor.id, username: tutor.username }
            });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});



module.exports = router;