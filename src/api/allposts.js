//
// src/api/posts.js
// API routes for fetching all posts and a single post by ID
// 1. GET /api/allposts - Fetch all posts with authors, categories, and comments count
// 2. GET /api/posts/:postId - Fetch a single post by ID with author and comments
// Uses Prisma Client to interact with the database
//

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Get all posts
router.get("/api/allposts", async (req, res) => {
  try {
    // Fetch posts with authors, categories, and comments count
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        _count: {
          select: { comments: true }, // Count of comments
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map over posts to include the comments count and category
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      author: post.author,
      commentsCount: post._count.comments,
      category: post.category,
    }));

    res.status(200).json({ posts: formattedPosts });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve posts" });
    console.error(error);
  }
});

// Get a single post by ID
router.get("/api/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        comments: true, 
      },
    });

    if (post) {
      res.status(200).json({ post });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve post" });
    console.error(error);
  }
});

module.exports = router;
