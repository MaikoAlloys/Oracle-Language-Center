const express = require("express");
const db = require("../db");
const router = express.Router();

// ✅ Fetch student full name
router.get("/info", async (req, res) => {  // ✅ Fixed path
    try {
        const studentId = req.query.student_id;
        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" });
        }

        db.query("SELECT first_name, last_name FROM users WHERE id = ?", [studentId], (err, results) => {
            if (err) {
                console.error("❌ Database error:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Student not found" });
            }

            const fullName = `${results[0].first_name} ${results[0].last_name}`;
            res.json({ fullName });
        });
    } catch (error) {
        console.error("❌ Error fetching student info:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Fetch Student Profile by ID
router.get("/:id", (req, res) => {  // ✅ Fixed path
    const studentId = req.params.id;

    db.query("SELECT first_name, last_name, email, phone FROM users WHERE id = ?", [studentId], (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(results[0]); // ✅ Return student details
    });
});

// 1️⃣ Fetch Active Course
router.get("/active-course/:id", (req, res) => {
    const studentId = req.params.id;

    db.query(`
        SELECT 
            st.student_id,  -- ✅ Include student_id
            st.course_id,   -- ✅ Include course_id
            c.name AS course_name, 
            tu.firstname AS tutor_first_name, 
            tu.lastname AS tutor_last_name, 
            st.assigned_at
        FROM student_tutors st
        JOIN courses c ON st.course_id = c.id
        JOIN tutors tu ON st.tutor_id = tu.id  
        WHERE st.student_id = ? AND st.status = 'in_progress'
        LIMIT 1
    `, [studentId], (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No active course found" });
        }

        console.log("✅ Sending Active Course Data:", results[0]); // Debugging
        res.json(results[0]); 
    });
});

// 2️⃣ Fetch Learning Resources
// 2️⃣ Fetch Learning Resources for Active Course
router.get("/course-resources/:student_id/:course_id", (req, res) => {
    const studentId = req.params.student_id;
    const courseId = req.params.course_id;

    // First validate the student is enrolled
    db.query(`
        SELECT 1 FROM student_tutors 
        WHERE student_id = ? 
        AND course_id = ?
        AND status = 'in_progress'
        LIMIT 1
    `, [studentId, courseId], (err, enrollment) => {
        if (err) {
            console.error("❌ Enrollment check error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (enrollment.length === 0) {
            return res.status(403).json({ message: "Student not enrolled in this course" });
        }

        // Now fetch the resources
        db.query(`
            SELECT 
                id,
                resource_name,
                created_at
            FROM learning_resources
            WHERE course_id = ?
            ORDER BY created_at DESC
        `, [courseId], (err, resources) => {
            if (err) {
                console.error("❌ Resources fetch error:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (resources.length === 0) {
                return res.status(404).json({ message: "No resources found for this course" });
            }

            // Return the array of resources directly (like your active course endpoint)
            res.json(resources.map(r => ({
                id: r.id,
                name: r.resource_name,
                added: r.created_at
            })));
        });
    });
});


// Check if a resource request exists
router.get("/students/resource-request/:studentId/:courseId/:resourceId", async (req, res) => {
    const { studentId, courseId, resourceId } = req.params;

    console.log("Checking resource request for:", { studentId, courseId, resourceId }); // Debugging

    try {
        const [rows] = await db.query(
            "SELECT * FROM resource_requests WHERE student_id = ? AND course_id = ? AND resource_id = ?",
            [studentId, courseId, resourceId]
        );

        if (rows.length > 0) {
            console.log("Resource request exists");
            return res.json({ exists: true });
        }

        console.log("No resource request found");
        res.json({ exists: false });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Database error", error });
    }
});

// Insert a new resource request
router.post("/students/resource-request/:studentId/:courseId/:resourceId", async (req, res) => {
    const { studentId, courseId, resourceId } = req.params;

    console.log("New resource request attempt for:", { studentId, courseId, resourceId });

    try {
        // Check if the request already exists
        const [existing] = await db.query(
            "SELECT id FROM resource_requests WHERE student_id = ? AND course_id = ? AND resource_id = ?",
            [studentId, courseId, resourceId]
        );

        if (existing.length > 0) {
            console.log("Request already exists");
            return res.status(400).json({ message: "Request already exists" });
        }

        // Insert new request
        await db.query(
            "INSERT INTO resource_requests (student_id, course_id, resource_id, requested_at) VALUES (?, ?, ?, NOW())",
            [studentId, courseId, resourceId]
        );

        console.log("Resource request inserted successfully");
        res.json({ message: "Resource request successful" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Database error", error });
    }
});

module.exports = router;
