import jwt from "jsonwebtoken";



const protect = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user info to request object
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized: Token expired" });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        // Log the error for debugging purposes
        console.error('Token verification error:', error);

        // General unauthorized response
        return res.status(401).json({ message: "Unauthorized" });
    }
};


export default protect