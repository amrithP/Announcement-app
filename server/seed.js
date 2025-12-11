import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/announcement';
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'Pr@1407rs';

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ username: DEFAULT_USERNAME });
    
    if (existingUser) {
      console.log(`User "${DEFAULT_USERNAME}" already exists. Skipping seed.`);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create default user
    const user = new User({
      username: DEFAULT_USERNAME,
      password: DEFAULT_PASSWORD
    });

    await user.save();
    console.log(`Default user created successfully!`);
    console.log(`Username: ${DEFAULT_USERNAME}`);
    console.log(`Password: ${DEFAULT_PASSWORD}`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();

