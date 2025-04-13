import jwt from "jsonwebtoken";
import User from "../models/user.model.js"

export const protectRoute=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"unauthorized: No token provided"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
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
        console.error("Error in protect route middleware",err.message);
        res.status(500).json({message:"internal server error"})
    }
}