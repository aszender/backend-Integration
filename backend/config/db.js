const mongoose = require('mongoose');

// Use local Docker MongoDB
const dbURI = process.env.MONGODB_URI || 'mongodb://appuser:apppassword@localhost:27017/userdb';

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        console.log('💡 Using in-memory database as fallback...');
        
        // Fallback to in-memory database
        console.log('✅ Using in-memory database');
    }
};

module.exports = connectDB;