import jwt from 'jsonwebtoken';
export const generateToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"30d",
    });
    res.cookie("jwt",token,{
        httpOnly: true,
        maxAge: 30*24*60*60*1000,
        sameSite: "none",
        secure: true,
        domain: ".vercel.app"
    });
    return token;
}