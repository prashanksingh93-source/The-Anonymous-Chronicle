import React, { useEffect, useState } from "react";
import axios from "axios";
import FundingBox from "../components/FundingBox";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/posts"
      );

      setPosts(response.data.posts);
    } catch (error) {
      console.error("Fetch posts error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-6 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-400">
            The Anonymous Chronicle
          </h1>

          <a
            href="/admin/login"
            className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700"
          >
            Admin
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold mb-3">
          Anonymous Stories
        </h2>

        <p className="text-slate-400 mb-10">
          Stories, thoughts and experiences shared anonymously.
        </p>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-slate-400">
              Loading posts...
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">
              No posts available yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
              >
                <h3 className="text-2xl font-bold text-emerald-400 mb-2">
                  {post.title}
                </h3>

                <p className="text-sm text-slate-500 mb-5">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>

                <p className="text-slate-300 leading-7 whitespace-pre-wrap">
                  {post.content}
                </p>
              </article>
            ))}
          </div>
        )}

        <FundingBox />
      </main>
    </div>
  );
};

export default Home;