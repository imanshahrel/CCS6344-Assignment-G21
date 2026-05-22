const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER USER
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    // validation
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please fill in all required fields"
        });
    }

    // check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email format"
        });
    }

    // check password length
    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters"
        });
    }

    try {
        // check existing email
        const checkSql = "SELECT * FROM users WHERE email = ?";

        db.query(checkSql, [email], async (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err
                });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            // hash password before storing in db
            const hashedPassword = await bcrypt.hash(password, 10);

            // insert user into mysql
            const insertSql =
                "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

            db.query(
                insertSql,
                [name, email, hashedPassword, role || "patient"],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Insert failed",
                            error: err
                        });
                    }

                    res.status(201).json({
                        message: "User registered successfully"
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error
        });
    }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    // check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email format"
        });
    }

    try {
        // find user by email
        const sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [email], async (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            const user = result[0];

            // compare entered password with hashed password in mysql
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            // generate JWT token after successful login
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.status(200).json({
                message: "Login successful",
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error
        });
    }
};

// GET ALL USERS - ADMIN ONLY
exports.getAllUsers = (req, res) => {
    const sql = `
        SELECT 
            u.id,
            u.name,
            u.email,
            u.role,
            u.specialization,
            u.assigned_doctor_id,
            d.name AS assignedDoctorName
        FROM users u
        LEFT JOIN users d ON u.assigned_doctor_id = d.id
        ORDER BY u.id DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch users",
                error: err
            });
        }

        res.status(200).json(result);
    });
};

// CREATE DOCTOR ACCOUNT - ADMIN ONLY
exports.createDoctor = async (req, res) => {
    const { name, email, password, specialization } = req.body;

    if (!name || !email || !password || !specialization) {
        return res.status(400).json({
            message: "Please fill in all doctor fields"
        });
    }

    try {
        const checkSql = "SELECT * FROM users WHERE email = ?";

        db.query(checkSql, [email], async (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err
                });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const insertSql = `
                INSERT INTO users (name, email, password, role, specialization)
                VALUES (?, ?, ?, 'doctor', ?)
            `;

            db.query(
                insertSql,
                [name, email, hashedPassword, specialization],
                (err) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Failed to create doctor",
                            error: err
                        });
                    }

                    res.status(201).json({
                        message: "Doctor account created successfully"
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};

// ASSIGN DOCTOR TO PATIENT - ADMIN ONLY
exports.assignDoctor = (req, res) => {
    const { patientId, doctorId } = req.body;

    if (!patientId || !doctorId) {
        return res.status(400).json({
            message: "Please select both patient and doctor"
        });
    }

    const sql = `
        UPDATE users
        SET assigned_doctor_id = ?
        WHERE id = ? AND role = 'patient'
    `;

    db.query(sql, [doctorId, patientId], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to assign doctor",
                error: err
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        res.status(200).json({
            message: "Doctor assigned successfully"
        });
    });
};