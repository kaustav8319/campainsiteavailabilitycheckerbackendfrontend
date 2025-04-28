import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

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

  const [showOtpDialog, setShowOtpDialog] = useState(false) // Control OTP dialog visibility
  const [otp, setOtp] = useState("") // Store OTP
  const [isOtpLoading, setIsOtpLoading] = useState(false) // Control loading state for OTP
  const [otpError, setOtpError] = useState("") // OTP error message

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
    setApiError("") // Clear API error when user types
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }

    // Name validation
    if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters."
      isValid = false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address."
      isValid = false
    }

    // Password validation
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters."
      isValid = false
    }

    // Confirm password validation
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
        // Format the data to match backend schema exactly
        const requestData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword
        }
        
        console.log("Sending registration data to API:", requestData)
        
        const response = await axios.post("http://localhost:8087/register", requestData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        console.log("API Response:", response.data)
        
        // Check if the response indicates success
        if (response.status === 200 || response.status === 201) {
          console.log("Registration successful, showing OTP dialog")
          // Show OTP dialog on successful registration
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
          // Handle validation errors from the backend
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
    setOtpError("") // Clear OTP error
  
    try {
      const response = await axios.post("http://localhost:8087/verify-otp", {
        email: formData.email,
        otp: otp,
      })
  
      if (response.status === 200) {
        console.log("OTP verified successfully")
        navigate("/") // OTP verified, redirect to login page
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
    setOtpError("") // Clear OTP error

    try {
      const response = await axios.post("http://localhost:8087/resend-otp", {
        email: formData.email,
      })

      if (response.status === 200) {
        console.log("OTP resent successfully")
        // Handle OTP resend success message here
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Create An Account</h2>
          <p className="text-gray-500">Enter your information to register</p>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* OTP Dialog */}
      {showOtpDialog && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full relative">
      {/* Close button with a larger 'X' symbol */}
      <button
        onClick={() => setShowOtpDialog(false)} // Close dialog when clicked
        className="absolute top-3 right-3 text-gray-500 hover:text-black text-4xl font-bold"
      >
        &times;
      </button>

      <h2 className="text-xl font-bold">Email Verification</h2>
      <p className="text-gray-600 mb-4">
        We've sent a 6-digit OTP to {formData.email}
      </p>

      <div className="space-y-4">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        {otpError && <p className="text-sm text-red-500">{otpError}</p>}
        <div className="flex justify-between">
          <button
            onClick={handleResendOtp}
            disabled={isOtpLoading}
            className="text-blue-600"
          >
            Resend OTP
          </button>
          <button
            onClick={handleVerifyOtp}
            disabled={isOtpLoading}
            className={`bg-blue-600 text-white px-4 py-2 rounded-md ${
              isOtpLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isOtpLoading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  )
}
