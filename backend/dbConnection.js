const mongoose = require("mongoose");

mongoose
  // .connect("mongodb://localhost:27017/auth")
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));

module.exports = mongoose;
