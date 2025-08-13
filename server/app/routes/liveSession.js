import { Router } from "express";
import { connectDB } from "../config/mongodbConnection.js";
import Mux from "@mux/mux-node";
import { LiveSession } from "../models/allModels.js";
const liveSessionRouter = Router();

const { Video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

liveSessionRouter.post("/insert-live-session", async (req, res) => {
  try {
    const liveStream = await Video.LiveStreams.create({
      playback_policy: ["public"],
      new_asset_settings: { playback_policy: ["public"] },
    });

    const muxStreamId = liveStream.id;
    const streamId = liveStream.stream_key;
    const playbackId = liveStream.playback_ids[0].id;

    const { course, date } = req.body;
    const liveSession = {
      course,
      muxStreamId,
      playbackId,
      streamId,
      isActive: true,
      date,
    };
    await connectDB();
    await LiveSession.create(liveSession);
    res.status(201).json({ message: "the liveSession is inserted.." });
  } catch (err) {
    res.status(403).json({ message: "Bad request" });
  }
});
liveSessionRouter.get("/get-live-session/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const sessions = await LiveSession.find({course:id})
    res.json({sessions});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default liveSessionRouter;
