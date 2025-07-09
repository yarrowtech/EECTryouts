import mongoose from "mongoose";

export default async function connectToMongoDB() {
    console.log("Starting connection to MongoDB...");
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI environment variable is not set");
    }
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
}