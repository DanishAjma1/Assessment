import { Router } from "express";
import { connectDB } from "../config/mongodbConnection.js";
import { Material } from "../models/allModels.js";
const materialRouter = Router();

materialRouter.post("/insertMaterial", async (req, res) => {
  try {
    const { course, instructor, filename, s3Key, contentType } = req.body;
    const material = {
      course,
      instructor,
      filename,
      s3Key,
      contentType,
    };
    await connectDB();
    const insertMaterial = await Material.insertOne(material);
    res.status(201).json({ message: "the material is inserted.." });
  } catch (err) {
    res.status(403).json({ message: "Bad request" });
  }
});
export default materialRouter;