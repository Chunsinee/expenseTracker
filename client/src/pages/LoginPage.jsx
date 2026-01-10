import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpenses } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { User, Lock, Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "../components/ui";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { fetchExpenses } = useExpenses();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const response = await api.post(endpoint, formData);

      if (isLogin) {
        // Login Success - Save token and user data
        login(response.data.token, response.data.user);
        await fetchExpenses();
        navigate("/dashboard");
      } else {
        // Register Success
        alert("Registration Successful! Please Sign In.");
        setIsLogin(true);
        // Clear password after successful registration
        setFormData({ ...formData, password: "" });
      }
    } catch (err) {
      console.error("Auth error:", err);

      // Better error handling
      let message = "Authentication failed";

      if (err.response) {
        // Server responded with error
        message = err.response.data?.message || message;
        console.error("Server error:", err.response.status, err.response.data);
      } else if (err.request) {
        // Request made but no response
        message =
          "Cannot connect to server. Please check if the server is running.";
        console.error("Network error:", err.request);
      } else {
        // Other errors
        message = err.message;
        console.error("Error:", err.message);
      }

      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="flex justify-center mb-10">
        <span className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent font-['Cabin']">
          Cash
        </span>
        <span className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent font-['Cabin']">
          Flow
        </span>
      </div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl overflow-hidden p-8 md:p-12">
        {/* Toggle Switch */}
        <div className="flex bg-gray-100 p-1 rounded-full mb-10 w-64 mx-auto">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isLogin
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
              !isLogin
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Register
          </button>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Sign up to start tracking your expenses"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Username Input */}
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                {isLogin ? <Mail size={20} /> : <User size={20} />}
              </div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500/20 text-gray-900 text-sm rounded-2xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-gray-400 font-medium"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500/20 text-gray-900 text-sm rounded-2xl py-4 pl-12 pr-12 outline-none transition-all placeholder:text-gray-400 font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                />
                <span className="text-gray-500 group-hover:text-gray-700 transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Forgot Password?
              </a>
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isLoading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </div>
    </div>
  );
};
