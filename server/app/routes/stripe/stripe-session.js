import Stripe from "stripe";
import { Course, Purchase } from "../../models/allModels.js";
import { Router } from "express";
import bodyParser from "body-parser";
import { connectDB } from "../../config/mongodbConnection.js";
const stripeRouter = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

stripeRouter.post("/stripe/api/create-checkout-session", async (req, res) => {
  try {
    await connectDB();
    const { courseId } = req.body;
    const course = await Course.find({ _id: courseId });
    if (!course) return res.status(404).send("Course not found");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: course.price,
            course_data: {
              title: course.title,
              description: course.description,
              price: course.price,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/course/${courseId}`,
      metadata: { courseId, studentId: req.session.user.id },
    });

    await Purchase.create({
      course: courseId,
      student: req.session.user.id,
      stripeCheckoutSessionId: session.id,
      amount: course.price,
      currency: session.currency || "usd",
      statusOfPurchase: "pending",
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
});

stripeRouter.post(
  "/stripe-webhook",
  bodyParser.raw({ type: "appliation/json" }),
  async (req, res) => {
    try {
      await connectDB();
      const sig = req.headers["stripe-signature"];
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        return res
          .status(400)
          .json({ message: "webhook error: " + err.message });
      }
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const purchase = await Purchase.findOne({
          stripeCheckoutSessionId: session.id,
        });
        purchase.statusOfPurchase = "paid";
        await purchase.save;
      }
      res.status(200).json({ received: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);

export default stripeRouter;
