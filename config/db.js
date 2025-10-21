

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('❌ MONGO_URI not set in .env file');
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);

    // Optional: more detailed debugging
    if (error.reason) {
      console.error('Reason:', error.reason);
    }

    // Exit process if connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
