//
// dashboard.tsx
// This file contains the Dashboard page component.
// It fetches the user's posts and comments from the server and displays them.
// It also provides links to create new posts and open Prisma Studio only for admin users.
// The Dashboard component is accessible only to authenticated users.
//

import { useContext, useState, useEffect, Suspense } from "react";
import { UserContext } from "../../contexts/UserContext";
import Layout from "../../layouts/layout";
import DOMPurify from "dompurify";
import Loading from "../../pages/Loading/Loading";
import { Link } from "react-router-dom";

// Define interfaces for the data
interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
  };
}

interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

// Lazy load AddPost component

const Dashboard = () => {
  const { user, logout } = useContext(UserContext);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      setError(null);

      if (user) {
        try {
          // Fetch user posts
          const postsResponse = await fetch(
            `https://api.navaneet.tech/api/users/${user.id}/posts`,
          );
          if (!postsResponse.ok) throw new Error("Failed to fetch posts");
          const postsData = await postsResponse.json();
          setUserPosts(postsData.posts);
          console.log(postsData);

          // Fetch user comments
          const commentsResponse = await fetch(
            `https://api.navaneet.tech/api/users/${user.id}/comments`,
          );
          if (!commentsResponse.ok) throw new Error("Failed to fetch comments");
          const commentsData = await commentsResponse.json();
          setUserComments(commentsData.comments);
          console.log(commentsData);
        } catch (err) {
          const error = err as Error;
          console.error("Error:", error.message);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserDetails();
  }, [user]);

  const handleOpenStudio = () => {
    window.open("http://0.0.0.0:5555", "_blank");
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(
        `https://api.navaneet.tech/api/posts/${postId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete post");

      // Update the local state to remove the deleted post
      setUserPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId),
      );
    } catch (err) {
      const error = err as Error;
      console.error("Error:", error.message);
      setError(error.message);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Layout>
        <div className="h-full bg-background-2 pb-28 pt-28">
          <div className="container mx-auto min-h-screen">
            {error && <p className="text-red-500">Error: {error}</p>}
            {user && !loading ? (
              <>
                <div className="space-x-4">
                  <h1 className="text-5xl mx-3 text-text-1">Dashboard</h1>
                  <h2 className="text-2xl text-text-1">Welcome, {user.name}</h2>
                  <button
                    onClick={logout}
                    className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-text-inv-1 hover:bg-blue-700"
                  >
                    Logout
                  </button>

                  <Suspense fallback={<Loading />}>
                    <button className="mt-4 rounded bg-orange-500 px-4 py-2 font-bold text-text-inv-1 hover:bg-orange-700">
                      <Link to="/add-post">Create a new post</Link>
                    </button>
                  </Suspense>

                  {user.admin && (
                    <button
                      onClick={handleOpenStudio}
                      className="mt-4 rounded bg-green-500 px-4 py-2 font-bold text-text-inv-1 hover:bg-green-700"
                    >
                      Open Prisma Studio
                    </button>
                  )}
                </div>
                <div className="mt-8 rounded bg-background-card p-6 text-text-1">
                  <h3 className="text-xl font-semibold">User Information</h3>
                  <p className="mt-2">Email: {user.email}</p>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold">Status</h3>
                    <div className="mt-4 rounded bg-background-2 p-4 shadow-md">
                      <p className="text-lg font-semibold">
                        Post Count: {userPosts.length}
                      </p>
                      <p className="text-lg font-semibold">
                        Comment Count: {userComments.length}
                      </p>
                    </div>
                  </div>

                  <h3 className="mb-6 mt-8 text-xl  font-semibold">
                    Your Posts
                  </h3>
                  <div className="grid grid-cols-1 gap-6 text-text-1  md:grid-cols-2 lg:grid-cols-3">
                    {userPosts.length > 0 ? (
                      userPosts.map((post) => (
                        <div
                          key={post.id}
                          className="rounded bg-white p-6 shadow-md"
                        >
                          <h4 className="text-2xl text-black font-bold">
                            {post.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {post.category} |{" "}
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                          <div
                            className="mt-4 line-clamp-2 rounded"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(post.content),
                            }}
                          />
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="mt-4 rounded bg-red-500 px-4 py-2 font-bold text-text-inv-1 hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No posts available.</p>
                    )}
                  </div>

                  <h3 className="mb-6 mt-8 text-xl font-semibold">
                    Your Comments
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {userComments.length > 0 ? (
                      userComments.map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded bg-white p-6 shadow-md"
                        >
                          <p className="mb-2 line-clamp-2 text-gray-700">
                            {comment.content.slice(0, 100)}...
                          </p>
                          <p className="text-sm text-gray-500">
                            Created at:{" "}
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No comments available.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2>You are not logged in.</h2>
                <h2>Login Failed. Please try again after some time.</h2>
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;
