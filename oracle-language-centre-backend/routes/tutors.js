const express = require("express");
const router = express.Router();
const db = require("../db"); // Keeping the existing database connection
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ✅ Middleware to authenticate Tutors
const authenticateTutor = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "tutor") {
            return res.status(403).json({ message: "Access denied. Not authorized." });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid token" });
    }
};

// ✅ Fetch All Tutors
router.get("/all", (req, res) => {
    db.query(
        "SELECT id, firstname, lastname FROM tutors",
        (err, results) => {
            if (err) {
                console.error("❌ Database Error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            res.json(results);
        }
    );
});

// ✅ Fetch Students Assigned to a Specific Tutor (Only Assigned Status)
router.get("/assigned-students", authenticateTutor, (req, res) => {
    const tutorId = req.user.id; // Tutor's ID from the token

    console.log(`✅ Fetching students assigned to Tutor ID: ${tutorId}`);

    const query = `
        SELECT 
            st.id AS assignment_id,
            u.id AS student_id,
            u.first_name,
            u.last_name,
            c.name AS course_name,
            st.assigned_at
        FROM student_tutors st
        JOIN users u ON st.student_id = u.id
        JOIN courses c ON st.course_id = c.id
        WHERE st.tutor_id = ? AND st.status = 'assigned' -- ✅ Added status filter
        ORDER BY st.assigned_at DESC
    `;

    db.query(query, [tutorId], (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        console.log(`✅ Found ${results.length} assigned students for Tutor ID ${tutorId}`);
        res.json(results);
    });
});

// ✅ Mark Student Learning as "In Progress"
router.put("/mark-in-progress/:studentId", authenticateTutor, (req, res) => {
    const tutorId = req.user.id; // Tutor ID from authentication middleware
    const studentId = req.params.studentId;

    // Check if the tutor is assigned to this student
    const queryCheck = "SELECT * FROM student_tutors WHERE student_id = ? AND tutor_id = ?";
    db.query(queryCheck, [studentId, tutorId], (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Internal server error." });
        }

        if (results.length === 0) {
            return res.status(403).json({ message: "You are not assigned to this student." });
        }

        // Update status to 'in_progress'
        const queryUpdate = "UPDATE student_tutors SET status = 'in_progress' WHERE student_id = ? AND tutor_id = ?";
        db.query(queryUpdate, [studentId, tutorId], (err) => {
            if (err) {
                console.error("❌ Database Error:", err);
                return res.status(500).json({ message: "Internal server error." });
            }

            res.json({ message: "Student learning marked as 'In Progress'." });
        });
    });
});

// ✅ Route to fetch students in progress with their assigned tutor
router.get("/students-in-progress", (req, res) => {
    const query = `
        SELECT u.id, u.username, u.first_name, u.last_name, u.email, u.phone, 
               st.status, t.id AS tutor_id, t.username AS tutor_username, 
               t.firstname AS tutor_firstname, t.lastname AS tutor_lastname
        FROM student_tutors st
        JOIN users u ON st.student_id = u.id
        LEFT JOIN tutors t ON st.tutor_id = t.id
        WHERE st.status = 'in_progress'
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err.sqlMessage || err);
            return res.status(500).json({ error: err.sqlMessage || "Internal server error" });
        }

        res.json(results);
    });
});


/// ✅ Fetch Tutor Profile by ID
router.get("/:id", (req, res) => {
    const tutorId = req.params.id;

    db.query("SELECT id, username, firstname, lastname, email, phone FROM tutors WHERE id = ?", 
    [tutorId], (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Tutor not found" });
        }

        res.json(results[0]); // ✅ Return tutor details
    });
});

module.exports = router;
