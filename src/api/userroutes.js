// 
// src/api/userRoutes.js
// API routes for fetching posts and comments by user ID and deleting a post by ID
// 1. GET /api/users/:userId/posts - Fetch all posts by user ID
// 2. GET /api/users/:userId/comments - Fetch all comments by user ID
// 3. DELETE /api/posts/:postId - Delete a post by ID
// Uses Prisma Client to interact with the database
//

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Route to get posts by user ID
router.get("/api/users/:userId/posts", async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      select: { id: true, title: true, content: true, createdAt: true , category: true},
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Failed to fetch posts", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Add this to the same file as the posts route

// Route to get comments by user ID
router.get("/api/users/:userId/comments", async (req, res) => {
  const { userId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { authorId: userId },
      select: { id: true, content: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Failed to fetch comments", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Route to delete a post by ID
router.delete("/api/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Delete the post
    await prisma.post.delete({
      where: { id: postId },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Failed to delete post", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});


module.exports = router;
