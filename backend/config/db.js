import mongoose from "mongoose";



const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Error connecting to MongoDB:", e.message);
    process.exit(1);
  }
};

export default dbConnection;
