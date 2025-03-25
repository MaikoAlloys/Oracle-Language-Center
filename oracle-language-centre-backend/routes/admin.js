const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const authMiddleware = require("../middleware/auth"); // Import auth middleware
require("dotenv").config();

const router = express.Router();

// Admin Login
router.post("/login", (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    db.query("SELECT * FROM admins WHERE name = ?", [name], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        if (results.length === 0) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const admin = results[0];
        const isMatch = password === admin.password; // Insecure, should use bcrypt

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ id: admin.id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.status(200).json({ message: "Login successful", token });
    });
});

// Get students by approval status
router.get("/students", (req, res) => {
    const { status } = req.query;
    let query = "SELECT * FROM users WHERE role = 'student'";
    
    if (status === "pending") query += " AND is_approved = 0";
    if (status === "approved") query += " AND is_approved = 1";

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json(results);
    });
});

// Approve a student
router.put("/students/:id/approve", (req, res) => {
    const { id } = req.params;
    db.query("UPDATE users SET is_approved = 1 WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json({ message: "Student approved successfully" });
    });
});

// Fetch all tutors
router.get("/tutors", (req, res) => {
    db.query("SELECT id, username, Firstname, Lastname FROM tutors", (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json(results);
    });
});

// Protect Admin Dashboard
router.get("/dashboard", authMiddleware, (req, res) => {
    res.json({ message: "Welcome to the Admin Dashboard!" });
});

module.exports = router;
