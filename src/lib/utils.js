import jwt from "jsonwebtoken";

// Generate Token
export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// Verify Token
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};