//
// /src/api/comments.js
// 1. GET /api/posts/:postId/comments - Fetch comments for a specific post
// 2. POST /api/posts/:postId/comments - Add a comment to a specific post
// 3. DELETE /api/posts/:postId/comments/:commentId - Delete a comment
// Uses Prisma Client to interact with the database
//

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Route to fetch comments for a specific post
router.get("/api/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: true, // Include author information in the response
      },
      orderBy: {
        createdAt: "desc", // Sort comments by creation time in descending order
      },
    });

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Failed to fetch comments", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Route to add a comment to a specific post
router.post("/api/posts/:postId/comments", async (req, res) => {
  const { content, authorId } = req.body;
  const { postId } = req.params;

  if (!content || !authorId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
      },
    });

    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.error("Failed to add comment", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Route to delete a comment
router.delete("/api/posts/:postId/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body; 
  
  try {
    // Fetch the comment to verify ownership
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the logged-in user is the author of the comment
    if (comment.authorId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Failed to delete comment", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

module.exports = router;
