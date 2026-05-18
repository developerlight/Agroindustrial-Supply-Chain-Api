// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("proses")
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("sudah proses")
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // stop app jika koneksi gagal
  }
};

module.exports = connectDB;