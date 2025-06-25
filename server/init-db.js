import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env file
dotenv.config({ path: path.join(__dirname, '.env') });

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app'
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

// Create initial database structure
const initializeDB = async () => {
  try {
    const conn = await connectDB();
    console.log('Database connection established');
    
    // Check if collections exist
    const collections = await conn.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    console.log('Existing collections:', collectionNames);
    console.log('Database initialization complete');
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Run the initialization
initializeDB();
