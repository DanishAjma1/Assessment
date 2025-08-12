import { Router } from "express";
import { connectDB } from "../config/mongodbConnection.js";
import { Material } from "../models/allModels.js";
const materialRouter = Router();

materialRouter.post("/insert-material", async (req, res) => {
  try {
    const { course, filename, s3key, contentType } = req.body;
    const material = {
      course,
      filename,
      s3key,
      contentType,
    };
    await connectDB();
    await Material.create(material);
    res.status(201).json({ message: "the material is inserted.." });
  } catch (err) {
    res.status(403).json({ message: "Bad request" });
  }
});

materialRouter.get("/material/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await connectDB();
    const material = await Material.find({course:id});
    res.status(200).json({material});
  } catch (err) {
    res.status(403).json({ message: "Bad request" });
  }
});
export default materialRouter;