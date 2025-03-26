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

// Check if a resource request exists and get status
// GET Request: Check resource request status
router.get("/resource-request/:studentId/:courseId/:resourceId", (req, res) => {
    const { studentId, courseId, resourceId } = req.params;

    console.log(`✅ GET request: Student ${studentId}, Course ${courseId}, Resource ${resourceId}`);

    db.query(
        "SELECT status FROM resource_requests WHERE student_id = ? AND course_id = ? AND resource_id = ?",
        [studentId, courseId, resourceId],
        (error, rows) => {
            if (error) {
                console.error("❌ Database error:", error);
                return res.status(500).json({ message: "Database operation failed", error: error.message });
            }

            console.log(`🔍 Query returned ${rows.length} rows`);

            if (rows.length > 0) {
                // Return the current status of the requested resource
                return res.json({ exists: true, status: rows[0].status });
            }

            // If no request exists, return the resource with a default status
            res.json({ exists: false, status: "not_requested" });
        }
    );
});

// POST Request: Submit resource request
router.post("/resource-request/:studentId/:courseId/:resourceId", (req, res) => {
    const { studentId, courseId, resourceId } = req.params;

    console.log(`✅ POST request: Student ${studentId}, Course ${courseId}, Resource ${resourceId}`);

    console.log("🔍 Checking if request already exists...");
    db.query(
        "SELECT id, status FROM resource_requests WHERE student_id = ? AND course_id = ? AND resource_id = ?",
        [studentId, courseId, resourceId],
        (error, existing) => {
            if (error) {
                console.error("❌ Database error:", error);
                return res.status(500).json({ message: "Database operation failed", error: error.message });
            }

            if (existing.length > 0) {
                console.log(`⚠️ Request exists with status: ${existing[0].status}`);
                // If the request already exists, return the current status
                return res.status(400).json({ message: "Request already exists", currentStatus: existing[0].status });
            }

            console.log("🆕 Inserting new resource request...");
            db.query(
                "INSERT INTO resource_requests (student_id, course_id, resource_id, requested_at, status) VALUES (?, ?, ?, NOW(), 'requested')",
                [studentId, courseId, resourceId],
                (error, result) => {
                    if (error) {
                        console.error("❌ Database error:", error);
                        return res.status(500).json({ message: "Database operation failed", error: error.message });
                    }

                    console.log(`✅ Insert successful, Request ID: ${result.insertId}`);
                    res.json({ success: true, message: "Resource request successful", status: "requested", requestId: result.insertId });
                }
            );
        }
    );
});

// POST Request: Confirm receipt of the resource
// POST Request: Confirm receipt of the resource
router.post("/confirm-receipt/:studentId/:courseId/:resourceId", (req, res) => {
    const { studentId, courseId, resourceId } = req.params;

    console.log(`✅ POST request: Confirming receipt for Student ${studentId}, Course ${courseId}, Resource ${resourceId}`);

    // Step 1: Fetch the current status and librarian_submitted field
    db.query(
        "SELECT status, librarian_submitted FROM resource_requests WHERE student_id = ? AND course_id = ? AND resource_id = ?",
        [studentId, courseId, resourceId],
        (error, results) => {
            if (error) {
                console.error("❌ Database error (fetching current status):", error);
                return res.status(500).json({ message: "Database operation failed", error: error.message });
            }

            if (results.length === 0) {
                console.log("⚠️ No record found for the given student, course, and resource.");
                return res.status(404).json({ message: "No record found for this resource request" });
            }

            const previousStatus = results[0].status;
            const librarianSubmitted = results[0].librarian_submitted;
            console.log(`📌 Previous status: ${previousStatus}, Librarian Submitted: ${librarianSubmitted}`);

            // Step 2: Update the student_confirmed field instead of inserting a new record
            db.query(
                "UPDATE resource_requests SET student_confirmed = 1 WHERE student_id = ? AND course_id = ? AND resource_id = ?",
                [studentId, courseId, resourceId],
                (updateError, updateResult) => {
                    if (updateError) {
                        console.error("❌ Database error (updating confirmation):", updateError);
                        return res.status(500).json({ message: "Database operation failed", error: updateError.message });
                    }

                    if (updateResult.affectedRows > 0) {
                        console.log(`✅ Resource confirmed for Student ${studentId}, Course ${courseId}, Resource ${resourceId}`);

                        // Step 3: Fetch the updated status after updating
                        db.query(
                            "SELECT status, student_confirmed FROM resource_requests WHERE student_id = ? AND course_id = ? AND resource_id = ?",
                            [studentId, courseId, resourceId],
                            (fetchError, fetchResults) => {
                                if (fetchError) {
                                    console.error("❌ Database error (fetching updated status):", fetchError);
                                    return res.status(500).json({ message: "Database operation failed", error: fetchError.message });
                                }

                                const updatedStatus = fetchResults[0]?.status;
                                const studentConfirmed = fetchResults[0]?.student_confirmed;
                                console.log(`🔄 Updated Status: ${updatedStatus}, Student Confirmed: ${studentConfirmed}`);

                                res.json({
                                    success: true,
                                    message: "Resource confirmation recorded successfully",
                                    previous_status: previousStatus,
                                    updated_status: updatedStatus,
                                    librarian_submitted: librarianSubmitted,
                                    student_confirmed: studentConfirmed
                                });
                            }
                        );
                    } else {
                        console.log("⚠️ Resource already confirmed or does not exist.");
                        res.status(400).json({ message: "Resource confirmation update failed or already confirmed" });
                    }
                }
            );
        }
    );
});



//endpoint for individual resource
/**
 * @route GET /students/resource-details/:studentId/:resourceId
 * @desc Fetch details of a specific resource requested by a student
 * @param {number} studentId - The ID of the student
 * @param {number} resourceId - The ID of the resource
 * @returns {Object} Resource details if found, else 404 Not Found
 */
// Endpoint for fetching a specific resource requested by a student
router.get('/resource-details/:studentId/:resourceId', (req, res) => {
    const { studentId, resourceId } = req.params;

    // SQL query
    const query = `
        SELECT lr.id AS resource_id, lr.resource_name, lr.course_id, lr.created_at,
               rr.status, rr.requested_at, rr.librarian_submitted, rr.student_confirmed
        FROM resource_requests rr
        JOIN learning_resources lr ON rr.resource_id = lr.id
        WHERE rr.student_id = ? AND rr.resource_id = ?
    `;

    // Execute query using a callback
    db.query(query, [studentId, resourceId], (error, results) => {
        if (error) {
            console.error('Error fetching resource details:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        if (results.length > 0) {
            res.json({ success: true, data: results[0] });
        } else {
            res.status(404).json({ success: false, message: 'Resource not found or not requested by the student' });
        }
    });
});


module.exports = router;
