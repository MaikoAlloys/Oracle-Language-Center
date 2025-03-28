const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const path = require("path");

// ✅ Middleware to authenticate user
const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid token" });
    }
};

// ✅ Submit Initial Payment
router.post("/", authenticateUser, (req, res) => {
    const { course_id, payment_method, reference_code, location, birth_year, id_number, amount_paid } = req.body;
    const student_id = req.user.id;

    if (!course_id || !payment_method || !reference_code || !location || !birth_year || !id_number || !amount_paid) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (isNaN(amount_paid) || parseFloat(amount_paid) <= 0) {
        return res.status(400).json({ message: "Amount paid must be a valid number greater than 0." });
    }
    if (!/^\d{4}$/.test(birth_year)) {
        return res.status(400).json({ message: "Birth year must be a 4-digit number." });
    }
    if (!/^\d{8}$/.test(id_number)) {
        return res.status(400).json({ message: "ID Number must be exactly 8 digits." });
    }
    if (payment_method === "mpesa" && reference_code.length !== 10) {
        return res.status(400).json({ message: "Mpesa reference must be exactly 10 characters." });
    }
    if (payment_method === "bank" && reference_code.length !== 14) {
        return res.status(400).json({ message: "Bank reference must be exactly 14 characters." });
    }

    const sql = `INSERT INTO payments (student_id, course_id, payment_method, reference_code, location, birth_year, id_number, amount_paid, status) 
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

// ✅ Make Additional Payment
// ✅ Make Additional Payment
router.post("/additional", authenticateUser, (req, res) => {
    const { course_id, payment_method, reference_code, amount_paid } = req.body;
    const student_id = req.user?.id; // Ensure user is authenticated

    if (!student_id) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (!course_id || !payment_method || !reference_code || !amount_paid) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (isNaN(amount_paid) || parseFloat(amount_paid) <= 0) {
        return res.status(400).json({ message: "Amount paid must be a valid number greater than 0." });
    }

    // Convert reference code to uppercase
    const referenceCodeUpper = reference_code.toUpperCase();

    // Validate payment method & reference code format
    const mpesaRegex = /^[a-zA-Z0-9]{10}$/;
    const bankRegex = /^[a-zA-Z0-9]{14}$/;

    if (payment_method === "mpesa" && !mpesaRegex.test(referenceCodeUpper)) {
        return res.status(400).json({ message: "Mpesa reference code must be exactly 10 alphanumeric characters." });
    }

    if (payment_method === "bank" && !bankRegex.test(referenceCodeUpper)) {
        return res.status(400).json({ message: "Bank reference code must be exactly 14 alphanumeric characters." });
    }

    // Check remaining balance
    const balanceQuery = `
        SELECT (c.fee - COALESCE(SUM(p.amount_paid), 0)) AS remaining_balance 
        FROM courses c 
        LEFT JOIN payments p ON c.id = p.course_id AND p.student_id = ?
        WHERE c.id = ?`;

    db.query(balanceQuery, [student_id, course_id], (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error." });
        }

        const remainingBalance = results[0]?.remaining_balance || 0;
        if (remainingBalance <= 0) {
            return res.status(400).json({ message: "No outstanding balance for this course." });
        }

        if (parseFloat(amount_paid) > remainingBalance) {
            return res.status(400).json({ message: "Amount exceeds the remaining balance." });
        }

        // Insert additional payment
        const insertQuery = `
            INSERT INTO payments (student_id, course_id, payment_method, reference_code, amount_paid, status) 
            VALUES (?, ?, ?, ?, ?, ?)`; 

        const values = [student_id, course_id, payment_method, referenceCodeUpper, parseFloat(amount_paid), "pending"];

        db.query(insertQuery, values, (err, result) => {
            if (err) {
                console.error("❌ Database Error:", err);
                return res.status(500).json({ message: "Database error.", error: err });
            }

            res.status(201).json({ message: "✅ Additional payment submitted. Pending approval." });
        });
    });
});

// ✅ Fetch Student Fee Records with Latest Payment Amount
router.get("/fees/:studentId", authenticateUser, (req, res) => {
    const { studentId } = req.params;

    const sql = `
        SELECT 
            c.id AS course_id, 
            c.name AS course_name, 
            c.fee AS total_fee, 
            SUM(p.amount_paid) AS amount_paid, 
            (c.fee - SUM(p.amount_paid)) AS balance, 
            (SELECT p2.status 
             FROM payments p2 
             WHERE p2.course_id = p.course_id 
             AND p2.student_id = p.student_id 
             ORDER BY p2.created_at DESC 
             LIMIT 1) AS status, 
            (SELECT p3.amount_paid 
             FROM payments p3 
             WHERE p3.course_id = p.course_id 
             AND p3.student_id = p.student_id 
             ORDER BY p3.created_at DESC 
             LIMIT 1) AS latest_amount_paid,
            (SELECT p4.payment_method 
             FROM payments p4 
             WHERE p4.course_id = p.course_id 
             AND p4.student_id = p.student_id 
             ORDER BY p4.created_at DESC 
             LIMIT 1) AS latest_payment_method,
            (SELECT p5.reference_code 
             FROM payments p5 
             WHERE p5.course_id = p.course_id 
             AND p5.student_id = p.student_id 
             ORDER BY p5.created_at DESC 
             LIMIT 1) AS latest_reference_code,
            MAX(p.created_at) AS latest_payment_date
        FROM payments p 
        JOIN courses c ON p.course_id = c.id 
        WHERE p.student_id = ? 
        GROUP BY p.course_id;
    `;

    db.query(sql, [studentId], (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
});


// ✅ Fetch All Payments;;for web admin
router.get("/", (req, res) => {
    const query = `
        SELECT 
            p.id, 
            u.first_name, 
            u.last_name, 
            c.name AS course_name, 
            c.fee AS total_fee, 
            p.amount_paid, 
            (c.fee - COALESCE((
                SELECT SUM(p2.amount_paid) 
                FROM payments p2 
                WHERE p2.course_id = p.course_id 
                AND p2.student_id = p.student_id 
                AND p2.created_at <= p.created_at
            ), 0)) AS balance, 
            p.payment_method, 
            p.reference_code, 
            p.status, 
            p.created_at 
        FROM payments p 
        JOIN users u ON p.student_id = u.id 
        JOIN courses c ON p.course_id = c.id 
        ORDER BY p.student_id, p.course_id, p.created_at ASC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});

// Checking eligibility for certification
router.get("/certificate-eligibility/:studentId", authenticateUser, (req, res) => {
    const { studentId } = req.params;

    const sql = `
        SELECT 
            c.id AS course_id, 
            c.name AS course_name, 
            c.fee AS total_fee, 
            SUM(p.amount_paid) AS amount_paid, 
            (c.fee - SUM(p.amount_paid)) AS balance, 
            (SELECT p2.status 
             FROM payments p2 
             WHERE p2.course_id = p.course_id 
             AND p2.student_id = p.student_id 
             ORDER BY p2.created_at DESC 
             LIMIT 1) AS latest_payment_status, 
            MAX(p.created_at) AS latest_payment_date,
            st.status AS tutor_status,
            -- Check if eligible for certification
            CASE 
                WHEN (c.fee - SUM(p.amount_paid)) = 0 
                AND st.status = 'completed' 
                AND (SELECT p2.status FROM payments p2 WHERE p2.course_id = p.course_id 
                     AND p2.student_id = p.student_id ORDER BY p2.created_at DESC LIMIT 1) = 'approved' 
                THEN 1 
                ELSE 0 
            END AS eligible_for_certificate
        FROM payments p 
        JOIN courses c ON p.course_id = c.id 
        JOIN student_tutors st ON st.student_id = p.student_id AND st.course_id = p.course_id
        WHERE p.student_id = ? 
        GROUP BY p.course_id;
    `;

    db.query(sql, [studentId], (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
});

//Fetch the required details (student name, course name, completion date) so the frontend can generate the certificate.
router.get("/certificate-details/:studentId/:courseId", authenticateUser, async (req, res) => {
    const { studentId, courseId } = req.params;

    try {
        // Query student details from the users table
        const [user] = await db.promise().query("SELECT first_name, last_name FROM users WHERE id = ?", [studentId]);

        // Check if the student exists
        if (!user || user.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Query course details from the courses table
        const [course] = await db.promise().query("SELECT id, name FROM courses WHERE id = ?", [courseId]);

        // Check if the course exists
        if (!course || course.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Construct response with student and course details
        const certificateData = {
            studentName: `${user[0].first_name} ${user[0].last_name}`, // Use the first item in the array for user data
            studentId: studentId, // Include the studentId
            courseId: course[0].id, // Include the courseId from courses table
            courseName: course[0].name, // Include the courseName from courses table
            issueDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD format for issueDate
        };

        // Return the certificate details as JSON
        res.json(certificateData);
    } catch (error) {
        // Log the error details for debugging
        console.error("❌ Error fetching certificate details:", error.message || error);

        // Send a more detailed error response
        res.status(500).json({ message: "Internal server error", error: error.message || error });
    }
});

// Endpoint for downloading certificate
router.get("/download-certificate/:studentId/:courseId", authenticateUser, (req, res) => {
    const { studentId, courseId } = req.params;

    // Path to the certificate file
    const certificatePath = path.join(__dirname, "..", "certificates", `student_${studentId}_course_${courseId}.pdf`);

    res.sendFile(certificatePath, (err) => {
        if (err) {
            console.error("❌ Error sending file:", err);
            res.status(404).json({ message: "Certificate not found" });
        }
    });
});

module.exports = router;
