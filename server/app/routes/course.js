import { Router } from "express";
import { connectDB } from "../config/mongodbConnection.js";
import { Course } from "../models/allModels.js";
const courseRouter = Router();

courseRouter.post("/insertCourse", async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const course = {
      title,
      description,
      price,
      instructor,
      liveSession,
      material,
    };
    await connectDB();
    const insertCourse = await Course.insertOne(course);
    res.status(201).json({ message: "the course is inserted.." });
  } catch (err) {
    res.status(403).json({ message: "Bad request" });
  }
});
export default courseRouter;