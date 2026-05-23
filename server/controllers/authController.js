const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logAction } = require("../utils/auditLogger");

// ── REGISTER ──────────────────────────────────────────────────────────────────
// POST /api/auth/register  OR  /api/users/register
// Accepts frontend field names: name, email, password, role
// Maps them to DB column names: user_name, user_email, user_password, user_role
exports.registerUser = async (req, res) => {
    // Accept both naming conventions (frontend sends: name, email, password)
    const name     = req.body.name     || req.body.user_name;
    const email    = req.body.email    || req.body.user_email;
    const password = req.body.password || req.body.user_password;
    const phone    = req.body.phone    || req.body.user_phone || "N/A"; // optional in form
    const role     = req.body.role     || req.body.user_role  || "patient";

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    try {
        // Check if email already exists
        const [existing] = await db.query(
            "SELECT user_id FROM users WHERE user_email = ?",
            [email]
        );
        if (existing.length > 0) {
            return res.status(400).json({ message: "Email already in use." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into DB
        const [result] = await db.query(
            "INSERT INTO users (user_name, user_email, user_password, user_role, user_phone) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashedPassword, role, phone]
        );

        const ip = req.ip || req.socket.remoteAddress;
        await logAction(result.insertId, "USER_REGISTER", ip);

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
// POST /api/auth/login  OR  /api/users/login
// Accepts frontend field names: email, password
exports.loginUser = async (req, res) => {
    // Accept both naming conventions
    const email    = req.body.email    || req.body.user_email;
    const password = req.body.password || req.body.user_password;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    try {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE user_email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.user_password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: user.user_id, email: user.user_email, role: user.user_role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const ip = req.ip || req.socket.remoteAddress;
        await logAction(user.user_id, "USER_LOGIN", ip);

        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user.user_id,
                name: user.user_name,
                email: user.user_email,
                role: user.user_role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};
