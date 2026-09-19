import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

const API_URL = "http://localhost:8000";

const AdminDashboard = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const [businessName, setBusinessName] = useState(
    "The Anonymous Chronicle"
  );
  const [upiId, setUpiId] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [fundingLoading, setFundingLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  // Get posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/posts`
      );

      setPosts(response.data.posts);
    } catch (error) {
      console.error(
        "Fetch posts error:",
        error.response?.data || error
      );
    } finally {
      setPostsLoading(false);
    }
  };

  // Get funding settings
  const fetchFundingSettings = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/funding`
      );

      const funding = response.data.funding;

      setBusinessName(funding.businessName);
      setUpiId(funding.upiId);
      setQrImage(funding.qrImage);
    } catch (error) {
      console.error(
        "Fetch funding error:",
        error.response?.data || error
      );
    } finally {
      setFundingLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchFundingSettings();
  }, []);

  // Create post
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login again.");
      window.location.href = "/admin/login";
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/posts`,
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Post published successfully!");

      setTitle("");
      setContent("");

      fetchPosts();
    } catch (error) {
      console.error(
        "Create post error:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      alert("Failed to publish post");
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    if (!token) {
      alert("Please login again.");
      window.location.href = "/admin/login";
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Post deleted successfully!");

      fetchPosts();
    } catch (error) {
      console.error(
        "Delete post error:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      alert("Failed to delete post");
    }
  };

  // Upload QR
  const handleQRUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("QR image must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setQrImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // Save funding
  const saveFundingSettings = async () => {
    if (!token) {
      alert("Please login again.");
      window.location.href = "/admin/login";
      return;
    }

    if (!businessName.trim()) {
      alert("Please enter a business name.");
      return;
    }

    if (!upiId.trim()) {
      alert("Please enter a business UPI ID.");
      return;
    }

    if (!qrImage) {
      alert("Please upload your business QR code.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/funding`,
        {
          businessName: businessName.trim(),
          upiId: upiId.trim(),
          qrImage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Funding settings saved successfully!");
    } catch (error) {
      console.error(
        "Save funding error:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      alert("Failed to save funding settings");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">

          <h1 className="text-2xl font-bold text-emerald-400">
            The Anonymous Chronicle
          </h1>

          <div className="flex gap-3">

            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700"
            >
              View Website
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">

        <h2 className="text-3xl font-bold mb-2">
          Admin Dashboard
        </h2>

        <p className="text-slate-400 mb-8">
          Create posts and manage your website.
        </p>

        {/* CREATE POST */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h3 className="text-xl font-semibold mb-6">
            Create New Post
          </h3>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>
              <label className="block mb-2">
                Post Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-emerald-400"
                required
              />
            </div>

            <div>
              <label className="block mb-2">
                Post Content
              </label>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post..."
                rows="8"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-emerald-400"
                required
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg"
            >
              Publish Post
            </button>

          </form>
        </div>

        {/* PUBLISHED POSTS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8">

          <h3 className="text-xl font-semibold mb-2">
            Published Posts
          </h3>

          <p className="text-slate-400 text-sm mb-6">
            Manage your published posts.
          </p>

          {postsLoading ? (
            <p className="text-slate-400">
              Loading posts...
            </p>
          ) : posts.length === 0 ? (
            <p className="text-slate-500">
              No posts published yet.
            </p>
          ) : (
            <div className="space-y-4">

              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-5"
                >

                  <div className="flex justify-between gap-4">

                    <div className="flex-1">

                      <h4 className="text-lg font-semibold text-emerald-400">
                        {post.title}
                      </h4>

                      <p className="text-xs text-slate-500 mt-1 mb-3">
                        {new Date(
                          post.createdAt
                        ).toLocaleDateString()}
                      </p>

                      <p className="text-slate-300 whitespace-pre-wrap">
                        {post.content}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        handleDeletePost(post._id)
                      }
                      className="h-fit p-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white"
                      title="Delete post"
                    >
                      <Trash2 size={20} />
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* FUNDING SETTINGS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8">

          <h3 className="text-xl font-semibold mb-2">
            Funding Settings
          </h3>

          <p className="text-slate-400 text-sm mb-6">
            Configure payment information shown to visitors.
          </p>

          {fundingLoading ? (
            <p className="text-slate-400">
              Loading funding settings...
            </p>
          ) : (
            <>
              <div className="mb-5">

                <label className="block mb-2">
                  Business / Display Name
                </label>

                <input
                  type="text"
                  value={businessName}
                  onChange={(e) =>
                    setBusinessName(e.target.value)
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-emerald-400"
                />

              </div>

              <div className="mb-5">

                <label className="block mb-2">
                  Business UPI ID
                </label>

                <input
                  type="text"
                  value={upiId}
                  onChange={(e) =>
                    setUpiId(e.target.value)
                  }
                  placeholder="yourbusiness@upi"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-emerald-400"
                />

              </div>

              <div className="mb-5">

                <label className="block mb-2">
                  Upload Business QR
                </label>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleQRUpload}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300"
                />

                <p className="text-xs text-slate-500 mt-2">
                  PNG, JPG or WEBP. Maximum 2 MB.
                </p>

              </div>

              {qrImage && (
                <div className="mb-6">

                  <p className="text-sm text-slate-400 mb-2">
                    QR Preview
                  </p>

                  <div className="bg-white p-3 rounded-xl inline-block">

                    <img
                      src={qrImage}
                      alt="Business QR"
                      className="w-48 h-48 object-contain"
                    />

                  </div>

                </div>
              )}

              <button
                onClick={saveFundingSettings}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg"
              >
                Save Funding Settings
              </button>
            </>
          )}

        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;