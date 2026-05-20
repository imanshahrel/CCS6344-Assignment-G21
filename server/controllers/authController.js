const db = require("../config/db");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const sql =
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

        db.query(
            sql,
            [name, email, hashedPassword, role],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Registration failed"
                    });
                }

                res.status(201).json({
                    message: "User registered successfully"
                });
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    registerUser
};