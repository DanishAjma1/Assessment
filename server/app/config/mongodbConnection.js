export const connectDB = async() => {
  try {
    const url = process.env.DB_URL;
    if (!url) {
      throw Error("URL is empty..");
    }
    const conn = await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
