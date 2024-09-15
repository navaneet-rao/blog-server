//
// NewFeed.tsx
// This file contains the NewFeed page component.
// It fetches the latest posts from the server and displays them in a list.
// It uses the DOMPurify library to sanitize HTML content before rendering it.
// The NewFeed component is accessible to all users.
//

import { useEffect, useState } from "react";
import Layout from "../../../layouts/layout";
import DOMPurify from "dompurify"; // For sanitizing HTML content
import Loading from "../../Loading/Loading";
import { Link } from "react-router-dom";

import "../ViewPost/ViewPost.css";

interface Post {
  id: string;
  title: string;
  content: string; // May contain HTML content
  createdAt: string;
  author: {
    name: string;
  };
  commentsCount: number; // Number of comments
  category: string; // Post category
}

const NewFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setError(null);
      try {
        const response = await fetch("https://api.navaneet.tech/api/allposts");
        const data = await response.json();

        console.log(data.posts);

        if (response.ok) {
          setPosts(data.posts);
        } else {
          setError(data.error || "Error fetching posts");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout>
      <div className="h-full bg-background-2 pb-10 pt-28">
        <main className="container mx-auto min-h-screen">
          <h1 className="mb-8 text-center text-3xl font-bold text-text-1">
            Latest Posts
          </h1>
          {error && <p className="text-red-500">Error: {error}</p>}
          {posts.length === 0 ? (
            <p className="text-center text-lg">No posts available</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-6 px-2">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex w-full flex-col rounded bg-background-1 p-2 shadow-md sm:w-[90%] sm:p-4 md:w-[48%] lg:w-[32%]"
                >
                  {/* Author Name and Category */}
                  <div className="mb-4 flex items-center text-sm text-gray-500">
                    <span className="mr-2">By {post.author.name}</span>
                    <span className="text-gray-400">|</span>
                    <span className="ml-2">{post.category}</span>
                  </div>

                  {/* Post Title */}
                  <h2 className="mb-4 text-lg font-bold text-text-1">
                    {post.title}
                  </h2>

                  {/* Render HTML content safely */}
                  <div
                    className="ViewPost-contant-section mt-auto line-clamp-3 text-text-1"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(post.content),
                    }}
                  />

                  {/* Footer with Comments Count, Date, and Read More button */}
                  <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                          />
                        </svg>
                      </span>
                      <span className="mr-2">
                        {post.commentsCount} Comment
                        {post.commentsCount !== 1 ? "s" : ""}
                      </span>
                      <span className="mr-2">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Link
                      to={`/post/${post.id}`}
                      className="text-blue-400 hover:text-indigo-400 hover:underline"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default NewFeed;

