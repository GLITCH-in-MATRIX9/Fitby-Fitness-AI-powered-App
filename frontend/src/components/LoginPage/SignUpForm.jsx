import { useState, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FaImage } from "react-icons/fa";

const SignUpForm = ({ switchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { login } = useContext(AuthContext);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", image); // must be a File object

    try {
      const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Signup successful");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed.");
    }
  };


  return (
    <>
      <h2 className="text-4xl font-bold text-[#ed6126] mb-6">Create Account</h2>
      <p className="text-gray-600 mb-8">Sign up to get started</p>

      <form className="space-y-6" onSubmit={handleSignUp} encType="multipart/form-data">
        <div>
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed6126]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ed6126]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 mb-1">Profile Image</label>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md border text-sm text-gray-700"
          >
            <FaImage /> Choose Image
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 object-cover mt-3 rounded-full border"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#ed6126] text-white py-2 rounded-md font-semibold hover:bg-black transition duration-200"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="text-[#ed6126] hover:underline"
        >
          Login
        </button>
      </p>
    </>
  );
};

export default SignUpForm;
