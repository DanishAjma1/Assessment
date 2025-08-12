import { Router } from "express";
import { connectDB } from "../config/mongodbConnection.js";
import { Course } from "../models/allModels.js";
const courseRouter = Router();

courseRouter.post("/create-course", async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const course = {
      title,
      description,
      price,
    };
    await connectDB();
    const cret = await Course.create({
      ...course,
      instructor: req.session.user.id,
    });
    console.log(cret);
    res.status(201).json({ message: "the course is inserted.." });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
});
courseRouter.get("/get-courses-for-instructor", async (req, res) => {
  try {
    await connectDB();
    const userId = req.session.user.id;
    const courses = await Course.find({ instructor: userId });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
courseRouter.get("/get-courses-for-student", async (req, res) => {
  try {
    await connectDB();
    const userId = req.session.user.id;
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default courseRouter;
