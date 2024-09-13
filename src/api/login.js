//
// src/api/login.js
// This file contains the login route. It checks the email and password
// provided by the user and returns a JWT token if the credentials are valid.
// The token is signed using a secret key and includes the user's ID and admin status.
// The token is valid for 1 hour.
// POST /api/login - Login route to authenticate users
// Uses Prisma Client to interact with the database
//


const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Find the user and include the admin field
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        admin: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a token (JWT) using environment variable for the secret key
    const token = jwt.sign(
      { userId: user.id, admin: user.admin },
      "default-secret-key",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      }, // Include admin field
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(error);
  }
});

module.exports = router;
