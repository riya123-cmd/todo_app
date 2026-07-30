const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader) {
            return res.status(401).json({
                message: "Access Denied. No Token."
            });
        }

        // Remove "Bearer " if it exists
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        const jwtSecret = process.env.JWT_SECRET || "mysecretkey";
        const verified = jwt.verify(token, jwtSecret);

        req.user = verified;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid Token"
        });
    }
};

module.exports = auth;