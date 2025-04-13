// import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/token.js";
import User from "../models/user.model.js"

export const protectRoute=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"unauthorized: No token provided"});
        }
        const decoded = verifyToken(token);
        if(!decoded || !decoded.userId){
            return res.status(401).json({message:"unauthorized: Invalid token"});    
        }
        const user=await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({message:"unauthorized: user not found"});
        }
        req.user=user;
        next();

    }catch(err){
        console.error("Error in protect route middleware:", err.message);

        // Handle specific JWT errors
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized: Token expired" });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        // Handle other errors
        res.status(500).json({ message: "Internal server error" });
    }
}