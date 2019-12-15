const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db.js");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps.js");

const app = express();

// Body parser
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"));
}
// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server exit
  server.close(() => process.exit(1));
});
