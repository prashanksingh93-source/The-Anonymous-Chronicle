import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      const token = response.data.token;

      localStorage.setItem("adminToken", token);

      alert("Login successful!");

      navigate("/admin/dashboard");
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-white flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Admin Login
        </h1>

        <p className="text-slate-400 text-center mb-8">
          Login to manage Global Relief Help
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>

            <label className="text-white block mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter admin email"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 outline-none focus:border-emerald-400"
              required
            />

          </div>

          <div>

            <label className="text-white block mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 outline-none focus:border-emerald-400"
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-semibold disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default AdminLogin;

