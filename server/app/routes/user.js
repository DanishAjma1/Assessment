import { Router } from "express";
import { connectDB } from "../config/mongodbConnection.js";
import { User } from "../models/allModels.js";
import bcrypt from "bcryptjs";
const userRouter = Router();

userRouter.post("/auth/register-user", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = {
      email,
      password,
      role,
    };
    const hashedPassword = bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await connectDB();
    const insertUser = await User.insertOne(user);
    res.status(201).json({ message: "the user is registered.." });
  } catch (err) {
    res.status(403).json({ message: "Bad request" });
  }
});

userRouter.post("/auth/login-user", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = {
      email,
      password,
      role,
    };
    await connectDB();
    const userFromDB = await User.findOne({ email });
    if (!userFromDB) {
      res.status(404).json({ message: "User not found" });
    } else {
      const hashedPassword = userFromDB.password;
      const isPasswordMatch = bcrypt.compareSync(password, hashedPassword);
      if (!isPasswordMatch) {
        res.status(401).json({ message: "Invalid credentials" });
      } else {
        req.session.user = {
          id: userFromDB._id,
          email: userFromDB.email,
          role: userFromDB.role,
        };
      }
      res.status(200).json({
        message: "User logged in successfully",
        user: {
          id: userFromDB._id,
        },
      });
    }
  } catch (err) {
    res.status(403).json({ message: "Bad request" });
  }
});

export default userRouter;
