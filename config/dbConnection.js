import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      "Database is Connected Successfully",
    );
  } catch (error) {
    "Error in Database Connection",
      console.log(error);
    process.exit(1);
  }
};

export default connectDb;
