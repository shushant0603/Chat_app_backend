import cloudinary from "../lib/Cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import Cloudinary from "../lib/Cloudinary.js";
import bcrypt from "bcryptjs";

export const signup= async(req,res)=>{
    const {fullname,email,password}=req.body;
   try{
    if(!fullname || !email || !password){
        return res.status(400).json({message:"all  are required"});
    }
     if(password.length<6){
        return res.status(400).json({message:"password must be at least 6 characters"});
     }
     const user=await User.findOne({email});
     if(user)return res.status(400).json({message:"email already exists"});
  
     const salt=await bcrypt.genSalt(10);
     const hashedPassword=await bcrypt.hash(password,salt);

     const newUser=new User({
         fullname,
         email,
         password:hashedPassword,
     });
     if(newUser){
       generateToken(newUser._id,res)
       await newUser.save();
         res.status(201).json(
                {
                    _id:newUser._id,
                    fullname:newUser.fullname,
                    email:newUser.email,
                    profilePic:newUser.profilePic,
                }
         );
     }
     else{
        res.status(400).json({message:"something went wrong"});
     }


   }catch(err){
         console.error("Error in signup controller",err.message);
         res.status(500).json({message:"internal server error"});
   }
}

export const login= async(req,res)=>{
 const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:"all fields are required"});
    }
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"invalid credentials"});
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"invalid credentials"});
        }
        generateToken(user._id,res);
        res.status(200).json(
            {
                _id:user._id,
                fullname:user.fullname,
                email:user.email,
                profilePic:user.profilePic,
            }
        ); 
        }catch(err){
            console.error("Error in login controller",err.message);
            res.status(500).json({message:"internal servererror"});
        }
    

}
export const logout=(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"logged out successfully"}); 
    }catch(err){
          console.log("error in logout controller",err.message);
          res.status(500).json({message:"Internal Server Error"});
    }
}
export const updateProfile=async(req,res)=>{
    try{
        const {profilePic}=req.body;
        const userId=req.user._id;

        if(!profilePic){
            return res.status(400).json({message:"profilePic is required"});
        }
        const uploadResponse=await cloudinary.uploader.upload(profilePic)
        const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
        res.status(200).json(updatedUser);

    }catch(err){
        console.error("Error in updateProfile controller",err.message);
        res.status(500).json({message:"internal server error"});
    }
}
export const checkAuth=(req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(err){
        console.error("Error in checkAuth controller",err.message);
        res.status(500).json({message:"internal server error"});
    }
}
