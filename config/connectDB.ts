import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// Add types to avoid TypeScript errors on global object
declare global {
  // Allow global `mongoose` to persist across hot reloads in development
  var mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null } | undefined;
}

// Global cache (avoids reconnecting on hot reload)
let cached = global.mongoose ?? { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongooseInstance) => {
      console.log('✅ Connected to MongoDB');
      return mongooseInstance.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    cached.promise = null;
    throw err;
  }
}