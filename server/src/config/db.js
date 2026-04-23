import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("MongoDB connection error: MONGO_URI is missing in server/.env");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);

    if (mongoUri.includes("mongodb.net")) {
      console.error(
        "Atlas troubleshooting: add your current public IP to Atlas Network Access or allow 0.0.0.0/0 for development."
      );
      console.error(
        "Atlas troubleshooting: verify database user/password and prefer the mongodb+srv connection string from Atlas Connect."
      );
    }

    process.exit(1);
  }
};

export default connectDB;
