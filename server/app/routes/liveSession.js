import { Router } from "express";
import { connectDB } from "../config/mongodbConnection.js";
import { LiveSession } from "../models/allModels.js";
const liveSessionRouter = Router();

const { Video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

liveSessionRouter.post("/insert-live-session", async (req, res) => {
  try {
     const liveStream = await Video.LiveStreams.create({
      playback_policy: ["public"], // or "signed" for restricted playback
      new_asset_settings: { playback_policy: ["public"] },
    });

       // liveStream will have: id, stream_key, playback_ids
    const muxStreamId = liveStream.id;
    const streamKey = liveStream.stream_key; // give to instructor privately
    const playbackId = liveStream.playback_ids[0].id;

    const { course,isActive,date } = req.body;
    const liveSession = {
      course,
      muxStreamId,
      playbackId,
      instructor:req.session.user.id,
      isActive,
      date,
    };
    await connectDB();
    const insertLiveSession = await LiveSession.insertOne(liveSession);
    res.status(201).json({ message: "the liveSession is inserted.." });
  } catch (err) {
    res.status(403).json({ message: "Bad request" });
  }
});
liveSessionRouter.get("/get-live-sessions", async (req, res) => {
  try {
    const sessions = await LiveSession.find().populate("course", "title");
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default liveSessionRouter;