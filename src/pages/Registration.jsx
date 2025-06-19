import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Tent, 
  Mountain, 
  Trees, 
  Sun,
  UserPlus,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  X,
  RotateCcw,
  Shield
} from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [otp, setOtp] = useState("")
  const [isOtpLoading, setIsOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
    setApiError("")
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }

    if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters."
      isValid = false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address."
      isValid = false
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters."
      isValid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Form submitted with data:", formData)

    if (validateForm()) {
      setIsLoading(true)
      setApiError("")

      try {
        const requestData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword
        }
        
        console.log("Sending registration data to API:", requestData)
        console.log("API URL is:", process.env.REACT_APP_API_URL);
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, requestData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        console.log("API Response:", response.data)
        
        if (response.status === 200 || response.status === 201) {
          console.log("Registration successful, showing OTP dialog")
          setShowOtpDialog(true)
        } else {
          console.log("Registration failed with response:", response.data)
          setApiError(response.data?.message || "Registration failed. Please try again.")
        }
      } catch (error) {
        console.error("Registration error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })
        
        if (error.response?.status === 422) {
          const validationErrors = error.response.data?.errors || error.response.data
          const errorMessage = Array.isArray(validationErrors) 
            ? validationErrors.join(", ")
            : "Please check your input data and try again."
          setApiError(errorMessage)
        } else if (error.response?.status === 409) {
          setApiError("Email already exists. Please use a different email.")
        } else if (error.response?.status === 400) {
          setApiError(error.response.data?.message || "Email already exists. Please use a different email.")
        } else {
          setApiError("Unable to connect to the server. Please try again later.")
        }
      } finally {
        setIsLoading(false)
      }
    } else {
      console.log("Form validation failed")
    }
  }

  const handleVerifyOtp = async () => {
    setIsOtpLoading(true)
    setOtpError("")
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/verify-otp`, {
        email: formData.email,
        otp: otp,
      })
  
      if (response.status === 200) {
        console.log("OTP verified successfully")
        navigate("/")
      } else {
        setOtpError("Invalid OTP. Please try again.")
      }
    } catch (error) {
      console.error("OTP verification error:", error)
  
      const backendDetail = error.response?.data?.detail
  
      if (backendDetail?.toLowerCase().includes("expired")) {
        setOtpError("OTP has expired. Click on 'Resend OTP' to get a new one.")
      } else if (backendDetail?.toLowerCase().includes("invalid")) {
        setOtpError("Invalid OTP. Please try again.")
      } else {
        setOtpError("An error occurred while verifying OTP. Please try again later.")
      }
    } finally {
      setIsOtpLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsOtpLoading(true)
    setOtpError("")

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/resend-otp`, {
        email: formData.email,
      })

      if (response.status === 200) {
        console.log("OTP resent successfully")
      } else {
        setOtpError("Failed to resend OTP. Please try again.")
      }
    } catch (error) {
      setOtpError("An error occurred while resending OTP. Please try again later.")
    } finally {
      setIsOtpLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-rose-200 to-orange-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-lg shadow-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-2xl shadow-lg">
              <Tent className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                CampSite Checker
              </h1>
              <p className="text-purple-600 font-medium">Join Our Adventure Community</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
        <div className="w-full max-w-md">
          {/* Register Card */}
          <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/20 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 p-8 text-center relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <UserPlus className="w-8 h-8 text-white" />
                  <h2 className="text-2xl font-bold text-white">Create Account</h2>
                </div>
                <p className="text-purple-100">Join thousands of outdoor enthusiasts</p>
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
                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <User className="w-4 h-4 text-purple-600" />
                    <span>Full Name</span>
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span>Email Address</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
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
                  <label htmlFor="password" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <Lock className="w-4 h-4 text-purple-600" />
                    <span>Password</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 pr-12 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
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

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <Lock className="w-4 h-4 text-purple-600" />
                    <span>Confirm Password</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 pr-12 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.confirmPassword}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-700 focus:ring-4 focus:ring-purple-200 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* OTP Dialog */}
      {showOtpDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden">
            {/* Dialog Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-white" />
                    <h2 className="text-xl font-bold text-white">Email Verification</h2>
                  </div>
                  <button
                    onClick={() => setShowOtpDialog(false)}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Dialog Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-6 text-center">
                We've sent a 6-digit verification code to{" "}
                <span className="font-semibold text-emerald-600">{formData.email}</span>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-center text-lg font-mono"
                  />
                </div>

                {otpError && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-sm text-red-700">{otpError}</p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={handleResendOtp}
                    disabled={isOtpLoading}
                    className="flex-1 px-4 py-3 border-2 border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors font-semibold flex items-center justify-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Resend</span>
                  </button>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isOtpLoading}
                    className={`flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 ${
                      isOtpLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isOtpLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Verify</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-lg border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-lg">
                <Tent className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-700">CampSite Checker</span>
            </div>
            
            <div className="flex items-center justify-center space-x-6">
              <Mountain className="w-6 h-6 text-purple-600" />
              <Trees className="w-6 h-6 text-pink-600" />
              <Sun className="w-6 h-6 text-yellow-600" />
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-600">
                © {new Date().getFullYear()} CampSite Checker. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}