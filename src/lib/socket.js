import {Server} from "socket.io";
import http from "http";
import express from "express";


const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:["https://chat-app-frontend-ugxs.onrender.com"],
        methods: ["GET", "POST"], // Allowed HTTP methods
        credentials: true, 
    }
});
export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}


//use to store online users
const userSocketMap={};

io.on("connection",(socket)=>{
    console.log("A user Connected",socket.id);
    const userId=socket.handshake.query.userId;
    if(userId)userSocketMap[userId]=socket.id;
     
    io.emit("getOnlineUsers",Object.keys(userSocketMap));


    socket.on("disconnect",()=>{
        console.log("A user Disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
});

export {io,app,server};