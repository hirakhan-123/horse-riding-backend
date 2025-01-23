const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const token = authHeader.split(' ')[1];  // Extract token from "Bearer <token>"
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Decode token

        if (!decoded.role) {
            return res.status(403).json({ message: "Access denied. Role not found." });
        }

        req.user = decoded;  // Attach user info (including role) to request
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(400).json({ message: "Invalid token." });
    }
};
