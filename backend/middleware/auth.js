const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT payload:", decoded);
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalid" });
    }
};

module.exports = authenticateToken;
