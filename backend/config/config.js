import mongoose from "mongoose";

const connectdb = async (mongoUri) => {
    try {
        // Remove deprecated options - not needed in Mongoose 6+
        await mongoose.connect(mongoUri);
        console.log("✅ Successfully connected to MongoDB");
        console.log("📊 Database:", mongoose.connection.name);
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        console.error("📍 Connection string:", mongoUri.replace(/\/\/.*@/, "//<credentials>@")); // Hide credentials in logs
        console.error("\n💡 Troubleshooting tips:");
        console.error("   1. Make sure MongoDB is running (sudo systemctl start mongod)");
        console.error("   2. Check your MONGO_URL in .env file");
        console.error("   3. Verify network connectivity to MongoDB");
        // Exit process if database connection fails
        process.exit(1);
    }
}

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
});

export default connectdb