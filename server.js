// Basics for app
const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")

// In-house modules
const connectDB = require("./config/db.js")
const errorHandler = require("./middleware/error.js")
const { protect, authorize } = require('./middleware/auth')

// Cookie parser
const cookieParser = require('cookie-parser')

// For basic security
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xssClean = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Route FILES
const posts = require('./routes/posts')
const admin = require('./routes/admin')
const auth = require('./routes/auth')

//** Set up app */
const app = express();

// Cookie parser
app.use(cookieParser())
// Body parser
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"));
}

// Sanitize data
app.use(mongoSanitize())
// Helmet for security headers
app.use(helmet())
// Prevent XSS attacks
app.use(xssClean())

// Allow CORS
app.use(cors())

// Rate limit
const limiter = rateLimit({
  windowMs: 10* 60 * 1000, // 10 min
  max: 100
})
app.use(limiter)

// Prevent HTTP parameter pollution
app.use(hpp())

// Mount routers
app.use('/api/v1/posts', posts)
app.use('/api/v1/admin', admin)
app.use('/api/v1/auth', auth)

// Use our custom error handler middleware
app.use(errorHandler);


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
