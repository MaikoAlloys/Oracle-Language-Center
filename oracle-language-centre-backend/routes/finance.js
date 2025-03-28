const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

// ✅ Middleware to authenticate finance manager
const authenticateFinance = (req, res, next) => {
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

        // Check if the role is finance
        if (decoded.role !== "finance") {
            console.log("❌ Unauthorized Role:", decoded.role); 
            return res.status(403).json({ message: "Access denied. Not authorized as finance." });
        }

        console.log("✅ Finance Role Verified"); // Debugging confirmation
        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ Token Verification Error:", error.message);
        return res.status(400).json({ message: "Invalid token" });
    }
};

// ✅ Fetch New Student Applicants (Pending Approval)
router.get("/new-applicants", authenticateFinance, (req, res) => {
    const query = `
        SELECT 
            u.first_name, 
            u.last_name, 
            c.name AS course_name, 
            p.status, 
            p.id AS payment_id 
        FROM payments p
        JOIN users u ON p.student_id = u.id
        JOIN courses c ON p.course_id = c.id
        WHERE p.status = 'pending'
        ORDER BY p.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});

// ✅ Fetch Latest Applicant Payment Details
router.get("/applicant-details/:payment_id", authenticateFinance, (req, res) => {
    const { payment_id } = req.params;

    const query = `
        WITH LatestPayment AS (
            SELECT 
                p.student_id, 
                p.course_id, 
                p.payment_method, 
                p.reference_code, 
                p.status, 
                p.amount_paid,  -- ✅ Fetch latest amount paid
                p.id AS latest_payment_id 
            FROM payments p
            WHERE p.student_id = (SELECT student_id FROM payments WHERE id = ?) 
            AND p.course_id = (SELECT course_id FROM payments WHERE id = ?)
            ORDER BY p.created_at DESC
            LIMIT 1
        )
        SELECT 
            u.first_name, 
            u.last_name, 
            u.email, 
            u.phone, 
            c.name AS course_name, 
            c.fee AS total_fee, 
            SUM(p.amount_paid) AS amount_paid, 
            (c.fee - SUM(p.amount_paid)) AS balance, 
            lp.payment_method AS latest_payment_method, 
            lp.reference_code AS latest_reference_code, 
            lp.status AS latest_status, 
            lp.amount_paid AS latest_amount_paid,  -- ✅ Include latest amount paid
            lp.latest_payment_id AS latest_payment_id
        FROM payments p
        JOIN users u ON p.student_id = u.id
        JOIN courses c ON p.course_id = c.id
        JOIN LatestPayment lp ON p.student_id = lp.student_id AND p.course_id = lp.course_id
        WHERE p.student_id = (SELECT student_id FROM payments WHERE id = ?) 
        AND p.course_id = (SELECT course_id FROM payments WHERE id = ?)
        GROUP BY p.course_id, u.id, lp.payment_method, lp.reference_code, lp.status, lp.amount_paid, lp.latest_payment_id;
    `;

    db.query(query, [payment_id, payment_id, payment_id, payment_id], (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        res.json(results[0]);
    });
});


// ✅ Approve Payment
// router.put("/approve-payment/:payment_id", authenticateFinance, (req, res) => {
//     const { payment_id } = req.params;

//     db.query(
//         "UPDATE payments SET status = 'approved' WHERE id = ?", 
//         [payment_id], 
//         (err, result) => {
//             if (err) {
//                 console.error("❌ Database Error:", err);
//                 return res.status(500).json({ message: "Database error" });
//             }
//             res.json({ message: "✅ Payment approved successfully!" });
//         }
//     );
// });

router.put("/approve-payment/:payment_id", authenticateFinance, (req, res) => {
    const { payment_id } = req.params;

    db.query(
        "UPDATE payments SET status = 'approved' WHERE id = ? AND status != 'approved'", 
        [payment_id], 
        (err, result) => {
            if (err) {
                console.error("❌ Database Error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            if (result.affectedRows === 0) {
                return res.status(400).json({ message: "Payment not found or already approved." });
            }
            res.json({ message: "✅ Payment approved successfully!" });
        }
    );
});


// ✅ Fetch Approved Students (Now same as Pending Students route)
router.get("/approved-students", authenticateFinance, (req, res) => {
    const query = `
        SELECT 
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
        ORDER BY p.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results); // ✅ Return results without any condition
    });
});


// ✅ Fetch Finance Manager Profile
router.get("/:financeId", (req, res) => {
    const { financeId } = req.params;

    db.query(
        "SELECT username, firstname, lastname, email, phone FROM finance_managers WHERE id = ?", 
        [financeId], 
        (err, results) => {
            if (err) {
                console.error("❌ Database Error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "Finance manager not found" });
            }
            res.json(results[0]);
        }
    );
});



module.exports = router;
