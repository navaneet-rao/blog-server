//
// server.js 
// is the entry point of the server application.
// It sets up the Express server, middleware, and API routes.
// The server listens on a specified port and logs a message when it starts.
// The server is configured to accept requests from any origin using CORS.
// The server uses the PrismaClient to interact with the database.
// The server uses the body-parser middleware to parse incoming requests.
// The server uses the express.json() middleware to parse JSON payloads.
// The server uses the express.urlencoded() middleware to parse URL-encoded payloads.
// The server uses the /api/admin, /api/signup, /api/login, /api/categories, /api/posts, /api/allposts, /api/comments, and /api/user routes.
// 


const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const app = express();
// const prisma = new PrismaClient();

// Middleware
app.use(cors());

// Increase the payload size limit (set appropriate size limit, e.g., 10MB)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// API Routes
const signupRoute = require("./src/api/sigup");
const loginRoute = require("./src/api/login");
const categoriesRoute = require("./src/api/categories");
const postRoute = require("./src/api/post");
const allpostRoute = require("./src/api/allposts");
const commentRoute = require("./src/api/comments");
const userRoutes = require("./src/api/userroutes");

app.use(signupRoute);
app.use(loginRoute);
app.use(categoriesRoute);
app.use(postRoute);
app.use(allpostRoute);
app.use(commentRoute);
app.use(userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
