import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
    setApiError("");
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (formData.password.length < 1) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!captchaValue) {
      setApiError("Please complete the reCAPTCHA.");
      return;
    }
  
    if (validateForm()) {
      setIsLoading(true);
      setApiError("");
  
      try {
        const response = await axios.post("http://localhost:8087/login", {
          ...formData,
          captcha_response: captchaValue, // ✅ Include CAPTCHA token
        });
  
        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          navigate("/availability");
        }
      } catch (error) {
        if (error.response?.status === 401) {
          const detail = error.response?.data?.detail;
          if (detail === "User not registered. Please register first.") {
            setApiError("You are not registered. Please sign up first.");
          } else if (detail === "The entered password does not match the registered password.") {
            setApiError("Incorrect password. Please try again.");
          } else {
            setApiError("Invalid login attempt. Please check your credentials.");
          }
        } else {
          setApiError("An error occurred during login. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="bg-white shadow-sm rounded-lg py-6 px-4 text-center">
        <h1 className="text-3xl font-extrabold text-blue-700">Campsite App</h1>
        <p className="text-sm text-gray-500 mt-1">Login to check campground availability</p>
      </header>

      {/* Main Content */}
      <main className="flex grow items-center justify-center">
        <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
            <p className="text-gray-500">Login to your account</p>
          </div>

          {apiError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{apiError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            
        <ReCAPTCHA
          sitekey="6LcRUCErAAAAAP28pZYyGN6zPb8DN2X0XC1ihvIo"  
          onChange={(value) => setCaptchaValue(value)}
        />

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2 px-4 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md transition duration-200 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-sm rounded-lg py-4 text-center text-sm text-gray-500 mt-6">
        &copy; {new Date().getFullYear()} Campsite App. All rights reserved.
      </footer>
    </div>
  );
}
