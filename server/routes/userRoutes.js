const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const userController = require("../controllers/userController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// ── Auth routes ───────────────────────────────────────────────────────────────
router.post("/register", registerUser);
router.post("/login", loginUser);

// ── Admin: assign doctor to patient ──────────────────────────────────────────
// PUT /api/users/assign-doctor
// Must be declared BEFORE /:id to avoid Express treating "assign-doctor" as an ID
router.put("/assign-doctor", verifyToken, verifyAdmin, userController.assignDoctor);

// ── User management ───────────────────────────────────────────────────────────
router.get("/", verifyToken, verifyAdmin, userController.getAllUsers);
router.get("/:id", verifyToken, userController.getUserById);
router.put("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyToken, verifyAdmin, userController.deleteUser);

module.exports = router;
