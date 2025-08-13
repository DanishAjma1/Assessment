import { Router } from "express";
import { connectDB } from "../config/mongodbConnection.js";
import { User } from "../models/allModels.js";
import bcryptjs from "bcryptjs";
const userRouter = Router();

userRouter.post("/register-user", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log("Password hashed");

    const user = { email, password: hashedPassword, role };

    await connectDB();

    // If using Mongoose:
    const insertUser = await User.create(user);

    console.log("User inserted:", insertUser);

    res.status(201).json({ message: "The user is registered" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: err.message }); // use 500 for server errors
  }
});

userRouter.post("/login-user", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    await connectDB();
    const userFromDB = await User.findOne({ email });
    if (!userFromDB || role !== userFromDB.role) {
      res
        .status(404)
        .json({
          message:
            "Either user not found or you are trying to sign in with wrong role.",
        });
    } else {
      const hashedPassword = userFromDB.password;
      const isPasswordMatch = bcryptjs.compareSync(password, hashedPassword);
      if (!isPasswordMatch) {
        res.status(401).json({ message: "Invalid credentials" });
      } else {
        req.session.user = {
          id: userFromDB.id,
          email: userFromDB.email,
          role: userFromDB.role,
        };
      }
      res.status(200).json({
        message: "User logged in successfully",
        user: {
          id: userFromDB.id,
        },
      });
    }
  } catch (err) {
    res.status(403).json({ message: "Bad request" });
  }
});

userRouter.get("/logout", (req, res) => {
  res.clearCookie("connect.sid");
  res.cookie.Date = new Date(0);
  res.status(200).json({ message: "User logged out successfully" });
});

export default userRouter;
