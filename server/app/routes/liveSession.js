import { Router } from "express";
import { connectDB } from "../config/mongodbConnection.js";
import { LiveSession } from "../models/allModels.js";
const liveSessionRouter = Router();

liveSessionRouter.post("/insertLiveSession", async (req, res) => {
  try {
    const { course, muxStreamId, playbackId, instructor, isActive } = req.body;
    const liveSession = {
      course,
      muxStreamId,
      playbackId,
      instructor,
      isActive,
    };
    await connectDB();
    const insertLiveSession = await LiveSession.insertOne(liveSession);
    res.status(201).json({ message: "the liveSession is inserted.." });
  } catch (err) {
    res.status(403).json({ message: "Bad request" });
  }
});

export default liveSessionRouter;