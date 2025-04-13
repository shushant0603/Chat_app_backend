import { verifyToken } from "../utils/token.js";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        // Get the token from cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify the token using the utility function
        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        // Find the user in the database
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (err) {
        console.error("Error in protect route middleware:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};