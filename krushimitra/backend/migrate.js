const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// 1. Database Connection String
const MONGO_URI = 'mongodb://localhost:27017/krushimitra_db';

// 2. Define the Blueprints (Must match your server.js models)
const plantSchema = new mongoose.Schema({
    id: String,
    name: String,
    category: String,
    price: Number,
    stockCount: Number,
    image: String,
    healthStatus: String
});

const enquirySchema = new mongoose.Schema({
    name: String,
    phone: String,
    message: String,
    date: String
});

const Plant = mongoose.model('Plant', plantSchema);
const Enquiry = mongoose.model('Enquiry', enquirySchema);

async function startMigration() {
    try {
        console.log("🚀 Starting Migration...");
        
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log("📡 Connected to MongoDB...");

        // Read db.json
        const dbPath = path.join(__dirname, 'db.json');
        if (!fs.existsSync(dbPath)) {
            console.log("❌ Error: db.json not found in this folder!");
            process.exit(1);
        }

        const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

        // Migrate Plants
        if (dbData.plants && dbData.plants.length > 0) {
            console.log(`📦 Found ${dbData.plants.length} plants. Moving...`);
            await Plant.deleteMany({}); // Clears existing data in Mongo to avoid duplicates
            await Plant.insertMany(dbData.plants);
            console.log("✅ Plants migrated successfully.");
        }

        // Migrate Enquiries
        if (dbData.enquiries && dbData.enquiries.length > 0) {
            console.log(`📦 Found ${dbData.enquiries.length} enquiries. Moving...`);
            await Enquiry.deleteMany({});
            await Enquiry.insertMany(dbData.enquiries);
            console.log("✅ Enquiries migrated successfully.");
        }

        console.log("🎉 All data moved! You can now start your server.js");
        process.exit(0);

    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

startMigration();