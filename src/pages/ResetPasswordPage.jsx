import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8087/reset-password", formData);
      if (response.status === 200) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to reset password.");
    }
  };
//   const handleResendOtp = async () => {
//     setError("");
//     setMessage("");
  
//     if (!formData.email) {
//       setError("Email is required to resend OTP.");
//       return;
//     }
  
//     try {
//       const response = await axios.post(
//         `http://localhost:8087/send-otp`,
//         { email: formData.email },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json"
//           }
//         }
//       );
  
//       const msg = response.data.message;
  
//       // Treat both cases as success
//       if (
//         msg === "User already verified." ||
//         response.status === 200 ||
//         response.status === 201
//       ) {
//         setMessage("OTP resent successfully.");
//         setFormData(prev => ({
//           ...prev,
//           otp: ""
//         }));
//       } else {
//         setError("Failed to resend OTP.");
//       }
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.message || "Something went wrong while resending OTP.";
//       setError(errorMsg);
//     }
//   };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
          {/* <p
            className="text-sm text-right text-blue-600 cursor-pointer hover:underline"
            onClick={handleResendOtp}
          >
            Resend OTP?
          </p> */}
          <input
            type="password"
            name="new_password"
            placeholder="New Password"
            value={formData.new_password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
