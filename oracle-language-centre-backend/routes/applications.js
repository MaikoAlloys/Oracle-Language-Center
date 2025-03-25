const express = require("express");
const db = require("../db");
const router = express.Router();

// ✅ Fetch Applied Courses for a Student
router.get("/:student_id", (req, res) => {  // ✅ Corrected path
    const studentId = req.params.student_id;

    const query = `
        SELECT 
            courses.name AS course_name, 
            courses.fee, 
            payments.status 
        FROM payments
        INNER JOIN courses ON payments.course_id = courses.id
        WHERE payments.student_id = ?`;

    db.query(query, [studentId], (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results.length ? results : { message: "No applications found" }); // ✅ Handle empty response
    });
});

module.exports = router;
