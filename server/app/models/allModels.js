import mongoose from "mongoose";

// User
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: {type: String, enum: ['student','instructor','admin'], default:'student'},
});

// Course
const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  price: Number,
});

// Material (files)
const MaterialSchema = new mongoose.Schema({
  course: {type: mongoose.Schema.Types.ObjectId, ref:'Course'},
  filename: String,
  s3key: String,
  contentType: String,
});

// Purchase / Enrollment
const PurchaseSchema = new mongoose.Schema({
  course: {type: mongoose.Schema.Types.ObjectId, ref:'Course'},
  student: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  amount: Number,
  currency: String,
  stripeCheckoutSessionId: String,
  statusOfPurchase: {type: String, enum:['pending','paid','failed'], default:'pending'},
});

// Live session
const LiveSessionSchema = new mongoose.Schema({
  course: {type: mongoose.Schema.Types.ObjectId, ref:'Course'},
  streamId:String,
  muxStreamId: String,
  playbackId: String,
  isActive: Boolean,
  date:Date,
});

//We can also define a model for each schema separately..

const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);
const Material = mongoose.model('Material', MaterialSchema);
const Purchase = mongoose.model('Purchase', PurchaseSchema);
const LiveSession = mongoose.model('LiveSession', LiveSessionSchema);

export { User, Course, Material, Purchase, LiveSession };