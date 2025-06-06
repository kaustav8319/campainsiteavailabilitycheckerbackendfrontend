import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { 
  Mail, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Tent, 
  Mountain, 
  Trees, 
  Sun,
  Shield,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || "";

  const [formData, setFormData] = useState({
    email: emailFromState,
    otp: "",
    new_password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/reset-password`, formData);
      if (response.status === 200) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-lg shadow-lg border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-3 rounded-2xl shadow-lg">
              <Tent className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                CampSite Finder
              </h1>
              <p className="text-orange-600 font-medium">Reset Your Password</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
        <div className="w-full max-w-md">
          {/* Reset Password Card */}
          <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/20 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-8 text-center relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Shield className="w-8 h-8 text-white" />
                  <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                </div>
                <p className="text-orange-100">Create a new secure password</p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              {message && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-green-700 font-medium">{message}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <Mail className="w-4 h-4 text-orange-600" />
                    <span>Email Address</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-12 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
                  </div>
                </div>

                {/* OTP Field */}
                <div className="space-y-2">
                  <label htmlFor="otp" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <Key className="w-4 h-4 text-orange-600" />
                    <span>Verification Code</span>
                  </label>
                  <div className="relative">
                    <input
                      id="otp"
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      value={formData.otp}
                      onChange={handleChange}
                      required
                      maxLength="6"
                      className="w-full px-4 py-3 pl-12 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-white/80 backdrop-blur-sm text-center font-mono text-lg"
                    />
                    <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                {/* New Password Field */}
                <div className="space-y-2">
                  <label htmlFor="new_password" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <Lock className="w-4 h-4 text-orange-600" />
                    <span>New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      id="new_password"
                      type={showPassword ? "text" : "password"}
                      name="new_password"
                      placeholder="Create a strong password"
                      value={formData.new_password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-12 pr-12 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-xl shadow-lg hover:from-orange-600 hover:to-amber-700 focus:ring-4 focus:ring-orange-200 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate("/")}
                  className="text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-colors flex items-center justify-center space-x-2 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Login</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-lg border-t border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-2 rounded-lg">
                <Tent className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-700">CampSite Finder</span>
            </div>
            
            <div className="flex items-center justify-center space-x-6">
              <Mountain className="w-6 h-6 text-orange-600" />
              <Trees className="w-6 h-6 text-amber-600" />
              <Sun className="w-6 h-6 text-yellow-600" />
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-600">
                © {new Date().getFullYear()} CampSite Finder. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}