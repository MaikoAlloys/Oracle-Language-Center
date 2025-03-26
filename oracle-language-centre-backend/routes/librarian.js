const express = require("express");
const router = express.Router();
const db = require("../db"); // Keeping the existing database connection
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ Middleware to authenticate librarian
const authenticateLibrarian = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Decoded Token:", decoded);

    // Ensure the token contains a valid role
    if (!decoded.role) {
      console.log("❌ Role not found in token");
      return res.status(403).json({ message: "Invalid token. Role missing." });
    }

    // Check if the role is librarian
    if (decoded.role !== "librarian") {
      console.log("❌ Unauthorized Role:", decoded.role); 
      return res.status(403).json({ message: "Access denied. Not authorized as librarian." });
    }

    console.log("✅ Librarian Role Verified"); // Debugging confirmation
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Token Verification Error:", error.message);
    return res.status(400).json({ message: "Invalid token" });
  }
};

// Open endpoint (no security)
router.get('/learning-resources', (req, res) => {
    const query = `
        SELECT 
            lr.id AS resource_id,
            lr.course_id,
            lr.resource_name,
            c.name AS course_name
        FROM learning_resources lr
        INNER JOIN courses c ON lr.course_id = c.id;
    `;
  
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching resources:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Group resources by course_id
        const groupedResources = results.reduce((acc, resource) => {
            if (!acc[resource.course_id]) {
                acc[resource.course_id] = {
                    course_name: resource.course_name,
                    resources: []
                };
            }
            acc[resource.course_id].resources.push({
                resource_id: resource.resource_id,
                resource_name: resource.resource_name
            });
            return acc;
        }, {});

        res.json(groupedResources);
    });
});


  // ✅ Fetch Librarian Profile
router.get("/profile", authenticateLibrarian, (req, res) => {
    const librarianId = req.user.id; // Get Librarian ID from token

    db.query(
        "SELECT username, first_name, last_name, email FROM librarians WHERE id = ?",
        [librarianId],
        (err, results) => {
            if (err) {
                console.error("❌ Database Error:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Librarian not found" });
            }

            res.json(results[0]);
        }
    );
});

// ✅ Fetch All Resource Requests with Student, Course, and Resource Names
router.get("/requests", (req, res) => {
    db.query(
        `SELECT 
            rr.id, 
            rr.student_id, 
            u.first_name AS student_first_name, 
            u.last_name AS student_last_name, 
            rr.course_id, 
            c.name AS course_name, 
            rr.resource_id, 
            lr.resource_name, 
            rr.requested_at, 
            rr.status, 
            rr.librarian_submitted, 
            rr.student_confirmed 
         FROM resource_requests rr
         JOIN users u ON rr.student_id = u.id
         JOIN courses c ON rr.course_id = c.id
         JOIN learning_resources lr ON rr.resource_id = lr.id`,
        (err, results) => {
            if (err) {
                console.error("❌ Database Error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            res.json(results);
        }
    );
});

// ✅ Submit Resource (Librarian Action)
router.put("/submit/:id", (req, res) => {
    const requestId = req.params.id;

    db.query(
        `UPDATE resource_requests 
         SET status = 'submitted', librarian_submitted = 1 
         WHERE id = ?`,
        [requestId],
        (err, result) => {
            if (err) {
                console.error("❌ Database Error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            res.json({ message: "Resource submitted successfully" });
        }
    );
});


module.exports = router; // Exporting the router
