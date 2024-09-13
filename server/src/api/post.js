//
// src/api/post.js
// This file contains the route to create a new post. It requires the title, content, category, and author ID to create a new post in the database.
// POST /api/posts - Create a new post
// Uses Prisma Client to interact with the database
//

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/api/posts", async (req, res) => {
  const { title, content, category, authorId } = req.body;

  if (!title || !content || !category || !authorId) {
    return res
      .status(400)
      .json({ error: "Title, content, category, and author are required" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        category,
        author: {
          connect: { id: authorId },
        },
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

module.exports = router;
