const jwt = require("jsonwebtoken");

// verify if user has valid JWT token
exports.verifyToken = (req, res, next) => {

    // get token from request header
    const authHeader = req.headers.authorization;

    // reject if token is missing
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    // extract token from "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    // verify token using secret key
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // store decoded user information
        req.user = decoded;

        // continue to next middleware/route
        next();

    } catch (error) {

        // reject invalid or expired token
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

// verify is user is admin
exports.verifyAdmin = (req, res, next) => {

    // check user role
    if (req.user.role !== "admin") {

        // deny if not admin
        return res.status(403).json({
            message: "Access denied. Admin only."
        });
    }

    // continue if user is admin
    next();
};