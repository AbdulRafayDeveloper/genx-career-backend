import mongoose from "mongoose";

const connectDb = async () => {
  const maxRetries = 3;
  const retryDelay = 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await mongoose.connect(process.env.CONNECTION_STRING);
      console.log("Database is Connected Successfully");
      return;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);

      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        console.error("Failed to connect to the database after multiple attempts.");
        process.exit(1);
      }
    }
  }
};

export default connectDb;
