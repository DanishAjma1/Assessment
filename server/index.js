import express  from "express";
import { createServer } from "http";
import cors from "cors";
import courseRouter from "./app/routes/course.js";
import liveSessionRouter from "./app/routes/liveSession.js";
import materialRouter from "./app/routes/material.js";
import userRouter from "./app/routes/user.js";
import purchaseRouter from "./app/routes/purchase.js";
import sessionMiddleware from "./app/middleware/auth/sessionMiddleware.js";
import cookieParser from "cookie-parser";
const app = express();
const server = createServer(app);


app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());
app.use(sessionMiddleware);

app.use("/instructor",courseRouter);
app.use("/instructor",liveSessionRouter);
app.use("/instructor",materialRouter);
app.use("/",userRouter);
app.use("/student",purchaseRouter);

server.listen(5000,()=>{
    console.log("server is running on port 5000");
})