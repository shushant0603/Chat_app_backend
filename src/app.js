import express from 'express'; //import Express
import dotenv from 'dotenv';  //import dotenv
import cookieParser from 'cookie-parser'; //import cookie-parser
import cors from 'cors'; //import cors
import {connectDB}from './lib/db.js'; //import connectDB function that we make in that folder
import {app,server} from './lib/socket.js'; //import app and server from socket.js file

import authRoutes from './routes/auth.route.js';   //import authtecication route that we make in that folder
import messageRoutes from './routes/message.route.js'; //import message route that we make in that folder
dotenv.config(); // dotenv configuration krna hota hai 


const PORT=process.env.PORT; //port number ko process.env.PORT me store krna hota hai

app.use(express.json({ limit: '10mb' })); // parses incoming request withJSON payloads
app.use(cookieParser()); // parses cookies attacged to the client request object
app.use(cors({
    origin:"https://chat-app-frontend-ugxs.onrender.com",
    methods: ["GET", "POST"],
    credentials:true,
}));


app.use("/api/auth",authRoutes); //use the authRoutes for the /api/auth endpoint mtlb ki jo bhi route /api/auth 
                                 //se strat hoti hai usme authRoutes ka use kro
app.use("/api/messages",messageRoutes); // sare message route ko check krega /api/message se start hone wale



server.listen(PORT,()=>{
    console.log("running");
    connectDB();
})