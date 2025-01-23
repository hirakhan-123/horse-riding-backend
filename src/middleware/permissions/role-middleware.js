exports.requireAdmin = (req, res, next) => {
    
    if (!req.user || !req.user.role) {
        return res.status(403).json({ message: "Access denied. Role not found." });
    }

    if (req.user.role.toUpperCase() !== 'ADMINISTRATOR') {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
};
