const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

// ✅ Middleware to authenticate HOD
const authenticateHOD = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "hod") {
            return res.status(403).json({ message: "Access denied. Not authorized." });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid token" });
    }
};

// ✅ Fetch Approved Students for HOD (Excluding Assigned Students)
router.get("/approved-students", authenticateHOD, (req, res) => {
    console.log("✅ HOD Fetching Approved Students..."); // Debugging

    const query = `
        SELECT 
            u.id AS student_id,
            u.first_name, 
            u.last_name, 
            c.name AS course_name, 
            p.amount_paid, 
            p.status,
            p.id AS payment_id
        FROM payments p
        JOIN users u ON p.student_id = u.id
        JOIN courses c ON p.course_id = c.id
        WHERE p.status = 'approved'
        AND u.id NOT IN (SELECT student_id FROM student_tutors) -- Exclude assigned students
        ORDER BY p.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        console.log("✅ Approved Students (Not Assigned) Found:", results.length); // Debugging
        res.json(results);
    });
});

// ✅ Fetch Tutors (For HOD)
router.get("/tutors", authenticateHOD, (req, res) => {
    console.log("✅ HOD Fetching Tutors..."); // Debugging

    db.query("SELECT id, firstname, lastname FROM tutors", (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        console.log("✅ Tutors Found:", results.length); // Debugging
        res.json(results);
    });
});

// ✅ Assign Tutor to Student
// ✅ Assign Tutor to Student (Includes Course ID)
router.post("/assign-tutor", authenticateHOD, (req, res) => {
    const { student_id, tutor_id } = req.body;

    if (!student_id || !tutor_id) {
        return res.status(400).json({ message: "Student ID and Tutor ID are required." });
    }

    console.log(`✅ Assigning Tutor ${tutor_id} to Student ${student_id}...`); // Debugging

    // ✅ Fetch Course ID from Payments Table
    db.query(
        "SELECT course_id FROM payments WHERE student_id = ? AND status = 'approved' LIMIT 1",
        [student_id],
        (err, results) => {
            if (err) {
                console.error("❌ Database Error (Fetching Course ID):", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (results.length === 0) {
                console.warn("⚠️ No course found for student.");
                return res.status(404).json({ message: "No course found for this student." });
            }

            const course_id = results[0].course_id;
            console.log(`✅ Found Course ID: ${course_id} for Student ${student_id}`);

            // ✅ Insert Data into `student_tutors`
            db.query(
                "INSERT INTO student_tutors (student_id, tutor_id, course_id) VALUES (?, ?, ?)",
                [student_id, tutor_id, course_id],
                (err, result) => {
                    if (err) {
                        console.error("❌ Database Error (Inserting Assignment):", err);
                        return res.status(500).json({ message: "Database error" });
                    }

                    console.log("✅ Tutor Assigned Successfully!");
                    res.json({ message: "✅ Tutor assigned successfully!" });
                }
            );
        }
    );
});

// ✅ Fetch HOD Profile
router.get("/profile", authenticateHOD, (req, res) => {
    const hodId = req.user.id; // Get HOD ID from token

    db.query(
        "SELECT username, firstname, lastname, email, phone FROM hods WHERE id = ?",
        [hodId],
        (err, results) => {
            if (err) {
                console.error("❌ Database Error:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "HOD not found" });
            }

            res.json(results[0]);
        }
    );
});


// ✅ Fetch Details of a Specific Assigned Student
router.get("/assigned-student/:id", authenticateHOD, (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT 
            u.first_name, 
            u.last_name, 
            c.name AS course_name,
            t.firstname AS tutor_firstname, 
            t.lastname AS tutor_lastname, 
            st.assigned_at 
        FROM student_tutors st
        JOIN users u ON st.student_id = u.id
        JOIN courses c ON st.course_id = c.id
        JOIN tutors t ON st.tutor_id = t.id
        WHERE st.id = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(results[0]);
    });
});


// ✅ Fetch Assigned Students for HOD
router.get("/assigned-students", authenticateHOD, (req, res) => {
    const query = `
        SELECT 
            st.id AS assignment_id,
            u.id AS student_id,
            u.first_name,
            u.last_name,
            c.name AS course_name,
            t.firstname AS tutor_firstname,
            t.lastname AS tutor_lastname,
            st.assigned_at
        FROM student_tutors st
        JOIN users u ON st.student_id = u.id
        JOIN courses c ON st.course_id = c.id
        JOIN tutors t ON st.tutor_id = t.id
        ORDER BY st.assigned_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});


module.exports = router;
