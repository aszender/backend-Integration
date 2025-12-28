import mongoose from 'mongoose';

const dbURI = process.env.MONGODB_URI || 'mongodb://appuser:apppassword@localhost:27017/userdb';

let useInMemoryDb = false;

export function shouldUseInMemoryDb() {
  return useInMemoryDb || mongoose.connection.readyState !== 1;
}

export async function connectDB() {
  try {
    await mongoose.connect(dbURI);
    // eslint-disable-next-line no-console
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Database connection failed:', error);
    // eslint-disable-next-line no-console
    console.log('💡 Using in-memory database as fallback...');
    useInMemoryDb = true;
  }
}
