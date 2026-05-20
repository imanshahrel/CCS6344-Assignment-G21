const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// test protected route
router.get("/profile", verifyToken, (req, res) => {
    res.json({
        message: "Access granted",
        user: req.user
    });
});

// admin only route
router.get("/admin", verifyToken, verifyAdmin, (req, res) => {
    res.json({
        message: "Welcome admin. Access granted.",
        user: req.user
    });
});
module.exports = router;