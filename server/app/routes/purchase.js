import { Router } from "express";
import { connectDB } from "../config/mongodbConnection.js";
import { Purchase } from "../models/allModels.js";
const purchaseRouter = Router();

purchaseRouter.post("/insertPurchase", async (req, res) => {
  try {
    const {
      course,
      student,
      amount,
      stripPaymentIntentId,
      stripeCheckoutSessionId,
      statusOfPurchase,
      material,
    } = req.body;
    const purchase = {
      course,
      student,
      amount,
      stripPaymentIntentId,
      stripeCheckoutSessionId,
      statusOfPurchase,
      material,
    };
    await connectDB();
    const insertPurchase = await Purchase.insertOne(purchase);
    res.status(201).json({ message: "the purchase is inserted.." });
  } catch (err) {
    res.status(403).json({ message: "Bad request" });
  }
});
export default purchaseRouter;