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

            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // insert user
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

    try {
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

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

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