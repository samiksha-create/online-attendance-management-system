// config/db.js
// Handles MongoDB connection using Mongoose

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance_db';

    const conn = await mongoose.connect(uri, {
      // Modern mongoose (v8) no longer needs useNewUrlParser / useUnifiedTopology
      // but keeping options object here for clarity / future flags.
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
