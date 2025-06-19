import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CampgroundNameInput from "./CampgroundNameInput";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Tent, 
  Calendar, 
  MapPin, 
  Search, 
  Share2, 
  LogOut, 
  Mountain, 
  Trees, 
  Sun,
  Moon,
  Star,
  Mail,
  Phone,
  User,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

const monthsMap = {
  1: "January",
  2: "February", 
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

const AvailabilityForm = () => {
  const navigate = useNavigate();
  const [campgroundName, setCampgroundName] = useState("");
  const [year, setYear] = useState(2025);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [availability, setAvailability] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });
  const [selectedSite, setSelectedSite] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleCheckboxChange = (month) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setAvailability({});
    setLoading(true);
    try {
      const requestData = {
        contactInfo: {
          name: "System Check",
          email: "system@check.com",
          whatsapp: "+1234567890"
        },
        campgroundName: campgroundName.trim(),
        year: parseInt(year),
        selectedMonths: selectedMonths,
        selectedSite: {
          site: "",
          loop: "",
          availableDates: []
        }
      };

      console.log("Sending request with data:", JSON.stringify(requestData, null, 2));
      const token = localStorage.getItem("token");

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/availability`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("API Response:", response.data);

      if (response.data && response.data.availability) {
        setAvailability(response.data.availability);
      } else {
        setErrorMessage("Invalid response format from server");
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response?.data);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setErrorMessage("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      }

      
      let errorMsg = "Failed to fetch availability. Please check input data.";
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMsg = error.response.data.detail.map(err => err.msg).join(", ");
        } else if (typeof error.response.data.detail === 'object') {
          errorMsg = error.response.data.detail.msg || errorMsg;
        } else {
          errorMsg = error.response.data.detail;
        }
      }
      setErrorMessage(errorMsg);
    }
    setLoading(false);
  };

  const handleContactSubmit = async (formData) => {
    try {
      const payload = {
        contactInfo: {
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp
        },
        campgroundName: campgroundName,
        year: parseInt(year),
        selectedMonths: selectedMonths,
        selectedSite: selectedSite
      };

      console.log("Sending contact form data:", payload);

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-availability`, payload);
      
      console.log("Contact form response:", response.data);

      if (response.data) {
        setShowContactModal(false);
        toast.success("Availability info sent successfully!");
      } else {
        toast.error("No response from server.");
      }
    } catch (error) {
      console.error("Error sending availability:", error);
      let errorMsg = "Failed to send availability information. Please try again.";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          errorMsg = error.response.data.message || error.response.data.detail || errorMsg;
        } else {
          errorMsg = error.response.data;
        }
      }
      
      alert(errorMsg);
    }
  };

  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month - 1, 1);
    const days = [];
    while (date.getMonth() === month - 1) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  const getStatusFromDate = (availabilities, date, year) => {
    if (!availabilities) {
        console.log("Availabilities is undefined or empty!");
        return "X";
    }

    if (!year) {
        console.log("Year is undefined!");
        return "X";
    }

    const dateString = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T00:00:00Z`;

    console.log(`📅 Checking status for: ${dateString}`);
    console.log("🗄️ Availabilities Data:", availabilities);

    const status = availabilities[dateString];

    if (status === "Available") {
        return "A";
    } else if (status === "Reserved") {
        return "R";
    } else {
        console.log(`No matching status found for ${dateString}, returning 'X'`);
        return "X";
    }
  };

  const getAvailableDates = (siteData) => {
    if (!siteData || !siteData.availabilities) {
      return []; 
    }
  
    const availableDates = [];
    Object.entries(siteData.availabilities).forEach(([date, status]) => {
      if (status === "Available") {
        availableDates.push(new Date(date).toLocaleDateString());
      }
    });
  
    return availableDates;
  };

  const ContactModal = ({ isOpen, onClose, onSubmit, selectedSite, campgroundName, year, selectedMonths }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      whatsapp: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await onSubmit(formData);
        setFormData({ name: '', email: '', whatsapp: '' });
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Share2 className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Share Availability</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4" />
                <span>Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                <span>WhatsApp Number</span>
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                
                placeholder="Include country code (e.g., +1)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300"
              />
              <p className="text-xs text-gray-500 mt-1">
                Include your country code (e.g., +91, +1). Leave empty if you don't want WhatsApp notifications.
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderAvailabilityTable = (monthData, year, month) => {
    if (!monthData) return null;
    
    const days = getDaysInMonth(year, month);
    
    return (
      <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
            <Calendar className="w-6 h-6" />
            <span>{monthsMap[month]} {year}</span>
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Tent className="w-4 h-4" />
                    <span>Sites</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-200">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Loop</span>
                  </div>
                </th>
                {days.map((date, index) => (
                  <th key={index} className="px-3 py-4 text-center text-sm font-bold text-gray-700 border-b-2 border-gray-200 min-w-[60px]">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">{getDayName(date)}</div>
                      <div className="text-lg">{date.getDate()}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.values(monthData).map((siteData, index) => {
                const availableDates = getAvailableDates(siteData);
                return (
                  <tr key={siteData.campsite_id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-indigo-600">{siteData.site}</span>
                        {availableDates.length > 0 && (
                          <button
                            onClick={() => {
                              setSelectedSite({
                                site: siteData.site,
                                loop: siteData.loop,
                                availableDates
                              });
                              setShowContactModal(true);
                            }}
                            className="flex items-center space-x-1 px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full hover:bg-emerald-600 transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>Share</span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 font-medium">{siteData.loop}</span>
                    </td>
                    {days.map((date, index) => {
                      const status = getStatusFromDate(siteData.availabilities, date, year);
                      let bgColor = 'bg-gray-100';
                      let textColor = 'text-gray-500';
                      let icon = <X className="w-4 h-4" />;
                      
                      if (status === 'A') {
                        bgColor = 'bg-emerald-100';
                        textColor = 'text-emerald-700';
                        icon = <Check className="w-4 h-4" />;
                      } else if (status === 'R') {
                        bgColor = 'bg-red-100';
                        textColor = 'text-red-700';
                        icon = <AlertCircle className="w-4 h-4" />;
                      }

                      return (
                        <td key={index} className="px-3 py-4 text-center">
                          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${bgColor} ${textColor} font-bold transition-all duration-200 hover:scale-110`}>
                            {icon}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-xl">
                <Tent className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  CampSite Checker
                </h1>
                <p className="text-sm text-gray-500">Find your perfect camping spot</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Mountain className="w-12 h-12 text-white" />
            <Trees className="w-12 h-12 text-white" />
            <Sun className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl font-bold text-white mb-4">
            Discover Amazing Campsites
          </h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Check real-time availability for your favorite campgrounds and plan the perfect outdoor adventure
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8">
            <h3 className="text-3xl font-bold text-white text-center flex items-center justify-center space-x-3">
              <Search className="w-8 h-8" />
              <span>Check Availability</span>
            </h3>
          </div>
          
          <div className="p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="flex items-center space-x-2 text-lg font-bold text-gray-700 mb-4">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>Campground Name</span>
                </label>
                <CampgroundNameInput
                  campgroundName={campgroundName}
                  setCampgroundName={setCampgroundName}
                />
                <p className="text-sm text-gray-500 mt-2 italic">
                  💡 Example: Enter campground name like "Cape Fair"
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-lg font-bold text-gray-700 mb-4">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span>Year</span>
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  min="2025"
                  max="2100"
                  className="w-full px-4 py-3 text-lg font-semibold border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white shadow-sm"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-lg font-bold text-gray-700 mb-4">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span>Select Months</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(monthsMap).map(([key, month]) => (
                    <label key={key} className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 cursor-pointer group">
                      <input
                        type="checkbox"
                        value={key}
                        checked={selectedMonths.includes(parseInt(key))}
                        onChange={() => handleCheckboxChange(parseInt(key))}
                        className="w-5 h-5 text-emerald-600 border-2 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                      />
                      <span className="font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors">
                        {month}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xl font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-teal-500 rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    <span>Check Availability</span>
                  </>
                )}
              </button>

            </form>

            {errorMessage && (
              <div className="mt-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-xl">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <p className="text-red-700 font-semibold">{errorMessage}</p>
                </div>
              </div>
            )}

            {Object.keys(availability).length > 0 && (
              <div className="mt-12">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl mb-8">
                  <h4 className="text-lg font-bold text-gray-700 mb-4 text-center">Legend</h4>
                  <div className="flex flex-wrap justify-center gap-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-700" />
                      </div>
                      <span className="font-semibold text-gray-700">Available</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-red-700" />
                      </div>
                      <span className="font-semibold text-gray-700">Reserved</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="font-semibold text-gray-700">Not Available</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {Object.entries(availability).map(([month, monthData]) => 
                    renderAvailabilityTable(monthData, year, parseInt(month))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-lg">
                  <Tent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">CampSite Checker</h3>
              </div>
              <p className="text-gray-400">
              •Your trusted companion for finding the perfect camping spots. Explore nature with confidence.
              </p>
              <p className="text-gray-400">
               •Never miss an open campsite again — get notified instantly.
              </p>
              <p className="text-gray-400">
               •Explore the wild. We’ll handle the availability checks..
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>Features</span>
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li>• Real-time availability</li>
                <li>• Multiple campground search</li>
                <li>• Easy sharing options</li>
                <li>• Mobile-friendly design</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Moon className="w-5 h-5 text-blue-400" />
                <span>Adventure Awaits</span>
              </h4>
              <p className="text-gray-400 mb-4">
                Start planning your next outdoor adventure today. Nature is calling!
              </p>
              <div className="flex space-x-4">
                <Mountain className="w-8 h-8 text-gray-600" />
                <Trees className="w-8 h-8 text-green-600" />
                <Sun className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 CampSite Checker. Powered by Gizmofacts.
            </p>
          </div>
        </div>
      </footer>

      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSubmit={handleContactSubmit}
        selectedSite={selectedSite}
        campgroundName={campgroundName}
        year={year}
        selectedMonths={selectedMonths}
      />
    </div>
  );
};

export default AvailabilityForm;