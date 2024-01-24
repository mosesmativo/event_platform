import mongoose from "mongoose";

// MongoDB URL
const MONGODB_URI = process.env.MONGODB_URL;

// Refering to the cached connection
let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  // Check if cashed is connected for the first time the sytem loads
  if (cached.conn) return cached.conn;

  // Check if MongoDb Uri is available
  if (!MONGODB_URI) throw new Error("MONGODB_URI is required");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "evently",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
