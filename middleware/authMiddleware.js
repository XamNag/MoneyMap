const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure you have a `.env` file with JWT_SECRET


const authenticateToken = (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No Token Provided." });
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next(); // Continue to the next middleware or route handler
    } 
    catch (error) {
        // Improved error handling (highly recommended):
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token Expired." });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: "Invalid Token." }); // Or "Malformed Token"
        } else {
            console.error("JWT Verification Error:", error); // Log for debugging
            return res.status(500).json({ message: "Authentication Failed." }); // Generic error
        }
    }
};

module.exports = authenticateToken;