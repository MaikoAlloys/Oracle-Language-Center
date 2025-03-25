const express = require("express");
const router = express.Router();
const db = require("../db"); // ✅ Ensure database connection
const jwt = require("jsonwebtoken");

// ✅ Middleware to authenticate user
const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request object
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid token" });
    }
};

// ✅ Submit Payment (Protected by Authentication Middleware)
router.post("/", authenticateUser, (req, res) => {
    const { course_id, payment_method, reference_code, location, birth_year, id_number, amount_paid } = req.body;
    const student_id = req.user.id; // Extract student_id from authenticated user

    // ✅ Validate Required Fields
    if (!course_id || !payment_method || !reference_code || !location || !birth_year || !id_number || !amount_paid) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Validate Numeric Fields
    if (isNaN(amount_paid) || parseFloat(amount_paid) <= 0) {
        return res.status(400).json({ message: "Amount paid must be a valid number greater than 0." });
    }
    if (!/^\d{4}$/.test(birth_year)) {
        return res.status(400).json({ message: "Birth year must be a 4-digit number." });
    }
    if (!/^\d{8}$/.test(id_number)) {
        return res.status(400).json({ message: "ID Number must be exactly 8 digits." });
    }

    // ✅ Validate Payment Method Reference Code Length
    if (payment_method === "mpesa" && reference_code.length !== 10) {
        return res.status(400).json({ message: "Mpesa reference must be exactly 10 characters." });
    }
    if (payment_method === "bank" && reference_code.length !== 14) {
        return res.status(400).json({ message: "Bank reference must be exactly 14 characters." });
    }

    // ✅ Insert Payment into Database
    const sql = `
        INSERT INTO payments (student_id, course_id, payment_method, reference_code, location, birth_year, id_number, amount_paid, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [student_id, course_id, payment_method, reference_code, location, birth_year, id_number, amount_paid, "pending"];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(201).json({ message: "✅ Payment submitted. Pending approval." });
    });
});

// ✅ Fetch Student Fee Records (NEW ROUTE)
router.get("/fees/:studentId", authenticateUser, (req, res) => {
    const { studentId } = req.params;

    const sql = `
        SELECT 
            c.name AS course_name, 
            c.fee AS total_fee,
            p.amount_paid, 
            (c.fee - p.amount_paid) AS balance, 
            p.payment_method, 
            p.status, 
            p.reference_code, 
            p.created_at 
        FROM payments p 
        JOIN courses c ON p.course_id = c.id 
        WHERE p.student_id = ?`;

    db.query(sql, [studentId], (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.json({ message: "No fee records found" });
        }
        res.json(results);
    });
});

// ✅ Fetch All Payments with Student & Course Details
router.get("/", async (req, res) => {
    try {
        const query = `
            SELECT 
                p.id, 
                u.first_name, 
                u.last_name, 
                c.name AS course_name, 
                c.fee AS total_fee, 
                p.amount_paid, 
                (c.fee - p.amount_paid) AS balance, 
                p.payment_method, 
                p.reference_code, 
                p.status, 
                p.created_at 
            FROM payments p
            JOIN users u ON p.student_id = u.id
            JOIN courses c ON p.course_id = c.id
            ORDER BY p.created_at DESC
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error("❌ Database Error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            res.json(results);
        });
    } catch (error) {
        console.error("❌ Error fetching payments:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
