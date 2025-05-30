import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CampgroundNameInput from "./CampgroundNameInput";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

    try {
      // Format the request data according to backend expectations
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

      const response = await axios.post("http://localhost:8087/availability", requestData, {
        headers: {
          'Content-Type': 'application/json'
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

      const response = await axios.post("http://localhost:8087/send-availability", payload);
      
      console.log("Contact form response:", response.data);

      if (response.data) {
        setShowContactModal(false);
        toast.success(" Availability info sent successfully!");
      } else {
        toast.error(" No response from server.");
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
        console.log(" Availabilities is undefined or empty!");
        return "X";
    }

    if (!year) {
        console.log(" Year is undefined!");
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
        console.log(` No matching status found for ${dateString}, returning 'X'`);
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
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '600px'
        }}>
          <h2 style={{ 
            marginBottom: '40px',
            fontSize: '24px',
            fontWeight: 'normal'
          }}>Send Availability Information</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '12px',
                fontSize: '18px'
              }}>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '12px',
                fontSize: '18px'
              }}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '12px',
                fontSize: '18px'
              }}>WhatsApp Number:</label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                required
                placeholder="Include country code (e.g., +1)"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              justifyContent: 'flex-end',
              marginTop: '40px'
            }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  minWidth: '120px'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#5B9BD5',
                  color: 'white',
                  cursor: 'pointer',
                  minWidth: '120px',
                  transition: 'background-color 0.3s ease, transform 0.1s ease', 
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#4A89C5')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#5B9BD5')} 
                onMouseDown={(e) => {
                  e.target.style.backgroundColor = '#3B78A4'; 
                  e.target.style.transform = 'scale(0.97)';
                }}
                onMouseUp={(e) => {
                  e.target.style.backgroundColor = '#4A89C5'; 
                  e.target.style.transform = 'scale(1)';
                }}
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
      <div style={{ marginTop: '30px', overflowX: 'auto' }}>
        <h3 style={{ marginBottom: '15px' }}>{monthsMap[month]} {year}</h3>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#4b6584' }}>
              <th style={{ 
                padding: '12px', 
                color: 'white', 
                textAlign: 'left',
                borderBottom: '1px solid #ddd',
                minWidth: '80px'
              }}>Sites</th>
              <th style={{ 
                padding: '12px', 
                color: 'white',
                textAlign: 'left',
                borderBottom: '1px solid #ddd',
                minWidth: '100px'
              }}>Loop</th>
              {days.map((date, index) => (
                <th key={index} style={{ 
                  padding: '12px', 
                  color: 'white',
                  textAlign: 'center',
                  borderBottom: '1px solid #ddd',
                  minWidth: '60px'
                }}>
                  <div>{getDayName(date)}</div>
                  <div>{date.getDate()}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.values(monthData).map((siteData) => {
              const availableDates = getAvailableDates(siteData);
              return (
                <tr key={siteData.campsite_id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ 
                    padding: '12px',
                    color: '#4b6584',
                    fontWeight: '500'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {siteData.site}
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
                          style={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Share
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>{siteData.loop}</span>
                    </div>
                  </td>
                  {days.map((date, index) => {
                    const status = getStatusFromDate(siteData.availabilities, date, year);
                    let backgroundColor = '#f5f6fa';
                    let textColor = '#424242';
                    
                    if (status === 'A') {
                      backgroundColor = '#e8f5e9';
                      textColor = '#2e7d32';
                    } else if (status === 'R') {
                      backgroundColor = '#ffebee';
                      textColor = '#c62828';
                    }

                    return (
                      <td key={index} style={{ 
                        padding: '12px',
                        textAlign: 'center',
                        backgroundColor,
                        color: textColor,
                        fontWeight: '500'
                      }}>
                        {status}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '15px 30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        marginBottom: '20px'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '24px',
          color: '#333',
          fontWeight: 'bold',
        }}>
          Campsite Availability Checker
        </h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' ,fontWeight:"bold"}}>Campsite Availability Checker</h2>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
      <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px',fontWeight:"bold" }}>Campground Name:</label>
              
        <CampgroundNameInput
          campgroundName={campgroundName}
          setCampgroundName={setCampgroundName}
        />

              <small style={{ color: '#888', fontStyle: 'italic', marginTop: '4px', display: 'block' }}>
                 Example: Enter campground name like "Cape Fair"
              </small>
        </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px',fontWeight:"bold" }}>Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            min="2025"
            max="2100"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontWeight:"bold"
                  
                }}
          />
        </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px',fontWeight:'bold'}}>Select Months:</label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '10px' 
              }}>
          {Object.entries(monthsMap).map(([key, month]) => (
                  <label key={key} style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight:'bold'
                  }}>
              <input
                type="checkbox"
                value={key}
                checked={selectedMonths.includes(parseInt(key))}
                onChange={() => handleCheckboxChange(parseInt(key))}
              />
              {month}
            </label>
          ))}
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#5B9BD5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#4A89C5'} 
              onMouseLeave={(e) => e.target.style.backgroundColor = '#5B9BD5'} 
              onMouseDown={(e) => e.target.style.backgroundColor = '#3B78A4'} 
              onMouseUp={(e) => e.target.style.backgroundColor = '#4A89C5'} 
            >
              Check Availability
            </button>
      </form>

          {errorMessage && (
            <p style={{ color: 'red', marginTop: '20px' }}>{errorMessage}</p>
          )}

          {Object.keys(availability).length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ 
                display: 'flex', 
                gap: '20px', 
                justifyContent: 'center',
                marginBottom: '20px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    backgroundColor: '#e8f5e9', 
                    color: '#2e7d32',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>A</span>
                  <span>Available</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    backgroundColor: '#ffebee', 
                    color: '#c62828',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>R</span>
                  <span>Reserved</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    backgroundColor: '#eeeeee', 
                    color: '#424242',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>X</span>
                  <span>Not Available</span>
                </div>
              </div>
              
              {Object.entries(availability).map(([month, monthData]) => 
                renderAvailabilityTable(monthData, year, parseInt(month))
              )}
            </div>
          )}
        </div>
          </div>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
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
