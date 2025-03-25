const express = require("express");
const db = require("../db");
const router = express.Router();

// ✅ Fetch all courses
router.get("/", (req, res) => {  // ✅ Corrected path
    db.query("SELECT * FROM courses", (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json(results);
    });
});

// ✅ Fetch course by ID
router.get("/:id", (req, res) => {  // ✅ Corrected path
    const courseId = req.params.id;
    
    db.query("SELECT * FROM courses WHERE id = ?", [courseId], (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json(results[0]);
    });
});

module.exports = router;
