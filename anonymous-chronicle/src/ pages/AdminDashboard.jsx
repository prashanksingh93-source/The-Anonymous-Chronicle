import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Pencil, X, LogOut } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  // -----------------------------
  // Posts
  // -----------------------------
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);

  const [editingPost, setEditingPost] = useState(null);

  // -----------------------------
  // Funding
  // -----------------------------
  const [businessName, setBusinessName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [qrImage, setQrImage] = useState("");

  // -----------------------------
  // Password
  // -----------------------------
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // -----------------------------
  // Loading states
  // -----------------------------
  const [postLoading, setPostLoading] = useState(false);
  const [fundingLoading, setFundingLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // -----------------------------
  // Get token
  // -----------------------------
  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // -----------------------------
  // Fetch posts
  // -----------------------------
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/posts`
      );

      setPosts(response.data.posts || []);
    } catch (error) {
      console.error(
        "Fetch posts error:",
        error.response?.data || error
      );

      alert("Failed to fetch posts");
    }
  };

  // -----------------------------
  // Fetch funding settings
  // -----------------------------
  const fetchFundingSettings = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/funding`
      );

      const funding = response.data.funding;

      setBusinessName(funding.businessName || "");
      setUpiId(funding.upiId || "");
      setQrImage(funding.qrImage || "");
    } catch (error) {
      // 404 simply means funding settings
      // have not been created yet.
      if (error.response?.status !== 404) {
        console.error(
          "Fetch funding error:",
          error.response?.data || error
        );
      }
    }
  };

  // -----------------------------
  // Initial load
  // -----------------------------
  useEffect(() => {
    fetchPosts();
    fetchFundingSettings();
  }, []);

  // -----------------------------
  // Create post
  // -----------------------------
  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter title and content");
      return;
    }

    try {
      setPostLoading(true);

      const token = getToken();

      await axios.post(
        `${API_URL}/api/posts`,
        {
          title: title.trim(),
          content: content.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Post created successfully");

      setTitle("");
      setContent("");

      fetchPosts();
    } catch (error) {
      console.error(
        "Create post error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to create post"
      );
    } finally {
      setPostLoading(false);
    }
  };

  // -----------------------------
  // Start editing post
  // -----------------------------
  const handleEditPost = (post) => {
    setEditingPost(post);

    setTitle(post.title);
    setContent(post.content);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // -----------------------------
  // Update post
  // -----------------------------
  const handleUpdatePost = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter title and content");
      return;
    }

    try {
      setPostLoading(true);

      const token = getToken();

      await axios.put(
        `${API_URL}/api/posts/${editingPost._id}`,
        {
          title: title.trim(),
          content: content.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Post updated successfully");

      setEditingPost(null);
      setTitle("");
      setContent("");

      fetchPosts();
    } catch (error) {
      console.error(
        "Update post error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update post"
      );
    } finally {
      setPostLoading(false);
    }
  };

  // -----------------------------
  // Cancel editing
  // -----------------------------
  const handleCancelEdit = () => {
    setEditingPost(null);
    setTitle("");
    setContent("");
  };

  // -----------------------------
  // Delete post
  // -----------------------------
  const handleDeletePost = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      const token = getToken();

      await axios.delete(
        `${API_URL}/api/posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Post deleted successfully");

      fetchPosts();
    } catch (error) {
      console.error(
        "Delete post error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete post"
      );
    }
  };

  // -----------------------------
  // QR image upload
  // -----------------------------
  const handleQrUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Maximum 2 MB
    if (file.size > 2 * 1024 * 1024) {
      alert("QR image must be smaller than 2 MB");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setQrImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // -----------------------------
  // Save funding settings
  // -----------------------------
  const handleSaveFunding = async (e) => {
    e.preventDefault();

    if (
      !businessName.trim() ||
      !upiId.trim() ||
      !qrImage
    ) {
      alert(
        "Business name, UPI ID and QR image are required"
      );
      return;
    }

    try {
      setFundingLoading(true);

      const token = getToken();

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

      alert("Funding settings saved successfully");
    } catch (error) {
      console.error(
        "Save funding error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save funding settings"
      );
    } finally {
      setFundingLoading(false);
    }
  };

  // -----------------------------
  // Change password
  // -----------------------------
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      alert(
        "Please enter current and new password"
      );
      return;
    }

    if (newPassword.length < 6) {
      alert(
        "New password must contain at least 6 characters"
      );
      return;
    }

    try {
      setPasswordLoading(true);

      const token = getToken();

      await axios.put(
        `${API_URL}/api/auth/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "Password changed successfully. Please login again."
      );

      localStorage.removeItem("adminToken");

      window.location.href = "/admin/login";
    } catch (error) {
      console.error(
        "Change password error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    localStorage.removeItem("adminToken");

    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-emerald-400">
              Global Relief Help
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Admin Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* -------------------------------- */}
        {/* Create / Edit Post */}
        {/* -------------------------------- */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {editingPost
                  ? "Edit Post"
                  : "Create Post"}
              </h2>

              <p className="text-slate-500 mt-1">
                {editingPost
                  ? "Update your published story"
                  : "Publish a new anonymous story"}
              </p>
            </div>

            {editingPost && (
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700"
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </div>

          <form
            onSubmit={
              editingPost
                ? handleUpdatePost
                : handleCreatePost
            }
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter post title"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Content
              </label>

              <textarea
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                placeholder="Write Stories of Hope."
                rows={8}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-400 resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={postLoading}
              className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-semibold disabled:opacity-50"
            >
              {postLoading
                ? editingPost
                  ? "Updating..."
                  : "Publishing..."
                : editingPost
                ? "Update Post"
                : "Publish Post"}
            </button>
          </form>
        </section>

        {/* -------------------------------- */}
        {/* Published Posts */}
        {/* -------------------------------- */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Published Posts
            </h2>

            <p className="text-slate-500 mt-1">
              Manage Stories of Hope
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-slate-500">
                No posts available.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="border border-slate-800 rounded-xl p-5 bg-slate-950"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-emerald-400">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(
                          post.createdAt
                        ).toLocaleDateString()}
                      </p>

                      <p className="text-slate-300 mt-4 leading-7 whitespace-pre-wrap">
                        {post.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleEditPost(post)
                        }
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                        title="Edit post"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleDeletePost(post._id)
                        }
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        title="Delete post"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* -------------------------------- */}
        {/* Funding Settings */}
        {/* -------------------------------- */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Funding Settings
            </h2>

            <p className="text-slate-500 mt-1">
              Configure your public support payment details
            </p>
          </div>

          <form
            onSubmit={handleSaveFunding}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Business / Display Name
              </label>

              <input
                type="text"
                value={businessName}
                onChange={(e) =>
                  setBusinessName(e.target.value)
                }
                placeholder="Enter business or display name"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                UPI ID
              </label>

              <input
                type="text"
                value={upiId}
                onChange={(e) =>
                  setUpiId(e.target.value)
                }
                placeholder="example@upi"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                QR Code
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleQrUpload}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
              />

              <p className="text-xs text-slate-500 mt-2">
                Maximum file size: 2 MB
              </p>
            </div>

            {qrImage && (
              <div className="mt-4">
                <p className="text-sm text-slate-400 mb-3">
                  QR Preview
                </p>

                <div className="bg-white rounded-xl p-4 w-fit">
                  <img
                    src={qrImage}
                    alt="Payment QR"
                    className="w-48 h-48 object-contain"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={fundingLoading}
              className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-semibold disabled:opacity-50"
            >
              {fundingLoading
                ? "Saving..."
                : "Save Funding Settings"}
            </button>
          </form>
        </section>

        {/* -------------------------------- */}
        {/* Change Password */}
        {/* -------------------------------- */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Change Password
            </h2>

            <p className="text-slate-500 mt-1">
              Update your admin account password
            </p>
          </div>

          <form
            onSubmit={handleChangePassword}
            className="space-y-5 max-w-xl"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Password
              </label>

              <input
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                placeholder="Enter current password"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="Enter new password"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-400"
              />

              <p className="text-xs text-slate-500 mt-2">
                Minimum 6 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold disabled:opacity-50"
            >
              {passwordLoading
                ? "Changing Password..."
                : "Change Password"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;