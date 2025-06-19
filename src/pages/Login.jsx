import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Tent, 
  Mountain, 
  Trees, 
  Sun,
  Shield,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaRef = useRef();

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
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
          ...formData,
          captcha_response: captchaValue, 
        });
  
        if (response.status === 200) {
           localStorage.setItem("token", response.data.access_token);
          navigate("/availability");
        }
      } catch (error) {
        recaptchaRef.current?.reset(); 
        setCaptchaValue("");
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-teal-200 to-emerald-200 rounded-full opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-lg shadow-lg border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-lg">
              <Tent className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                CampSite Checker
              </h1>
              <p className="text-emerald-600 font-medium">Your Gateway to Nature's Best</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/20 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 text-center relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Shield className="w-8 h-8 text-white" />
                  <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                </div>
                <p className="text-emerald-100">Sign in to explore amazing campsites</p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              {apiError && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 font-medium">{apiError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span>Email Address</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <Lock className="w-4 h-4 text-emerald-600" />
                      <span>Password</span>
                    </label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 pr-12 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>
                
                {/* reCAPTCHA - Mobile Responsive */}
                <div className="flex justify-center">
                  <div className="recaptcha-container">
                    <ReCAPTCHA
                      sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}  
                      ref={recaptchaRef}
                      onChange={(value) => setCaptchaValue(value)}
                      size="normal"
                      theme="light"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:from-emerald-600 hover:to-teal-700 focus:ring-4 focus:ring-emerald-200 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link 
                    to="/register" 
                    className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-lg border-t border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-lg">
                <Tent className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-700">CampSite Checker</span>
            </div>
            
            <div className="flex items-center justify-center space-x-6">
              <Mountain className="w-6 h-6 text-emerald-600" />
              <Trees className="w-6 h-6 text-teal-600" />
              <Sun className="w-6 h-6 text-yellow-600" />
            </div>
            
            <div className="text-center md:text-right">
                <p className="text-gray-600">
                  © {new Date().getFullYear()} CampSite Checker. All rights reserved.
                </p>
                <div className="mt-2 space-x-4">
                  {/* <Link to="/terms" className="underline hover:text-teal-600 block md:inline">
                    Terms & Conditions
                  </Link>
                  <Link to="/privacy" className="underline hover:text-teal-600 block md:inline">
                    Privacy Policy
                  </Link> */}
                </div>
              </div>

          </div>
        </div>
      </footer>
    </div>
  );
}