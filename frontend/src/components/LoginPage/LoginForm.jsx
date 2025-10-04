import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = ({ switchToSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        login({ token: data.token, user: data.user });
        navigate("/");
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error.");
    }
  };

  return (
    <>
      <h2 className="text-4xl font-bold text-[#ed6126] mb-6">Welcome Back</h2>
      <p className="text-gray-600 mb-8">Login to your account</p>

      <form className="space-y-6" onSubmit={handleLogin}>
        {/* Email */}
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed6126]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password with eye toggle */}
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed6126] pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#ed6126] text-white py-2 rounded-md font-semibold hover:bg-black transition duration-200"
        >
          Login
        </button>
      </form>

      {/* Switch to signup */}
      <p className="mt-6 text-sm text-gray-600">
        Don’t have an account?{" "}
        <button
          onClick={switchToSignUp}
          className="text-[#ed6126] hover:underline"
        >
          Sign up
        </button>
      </p>
    </>
  );
};

export default LoginForm;
