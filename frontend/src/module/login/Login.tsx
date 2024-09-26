import React, {
  useState,
  useCallback,
  ChangeEvent,
  FormEvent,
  useEffect,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import "./login.css";
import Verification from "../../component/Verification/verification";

const API_URL = "http://localhost:7007";

interface FormData {
  phone: string;
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    phone: "",
    email: "",
    password: "",
  });
  const [countryCode, setCountryCode] = useState<string>("+92");
  const [countryCodes, setCountryCodes] = useState<{ [key: string]: string }>(
    {}
  );
  const [showVerification, setShowVerification] = useState(false);
  const navigate = useNavigate();

  // Fetch country codes on mount
  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const response = await fetch(`${API_URL}/country-codes`, {
          method: "GET",
        });
        const data = await response.json();
        console.log("Fetched country codes:", data);
        setCountryCodes(data);
        setCountryCode(data.Pak); // Default country code
      } catch (error) {
        console.error("Error fetching country codes: ", error);
      }
    };

    fetchCountryCodes();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginUser = async (loginData: FormData) => {
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (data.token) {
        navigate("/form");
      } else {
        window.alert("Login failed");
      }
    } catch (error) {
      console.error("Server side error: ", error);
    }
  };

  const sendOtpCode = async (phone: string) => {
    try {
      const response = await fetch(`${API_URL}/otp/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, countryCode }),
      });
      const data = await response.json();
      console.log("OTP response:", data);
      setShowVerification(true); // Show verification popup
    } catch (error) {
      console.error("Error sending verification code: ", error);
      window.alert("Failed to send verification code");
    }
  };

  const loginSubmission = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const fullPhone = `${countryCode}${formData.phone}`; // Combine country code and phone number
      console.log("Full phone number:", fullPhone);
      sendOtpCode(fullPhone); // Send OTP with the full phone number
    },
    [formData.phone, countryCode, sendOtpCode]
  );

  const handleVerificationClose = () => setShowVerification(false);
  const handleVerificationSuccess = async (code: string) => {
    const fullPhone = `${countryCode}${formData.phone}`; // Use full phone number for verification
    console.log("Verifying OTP code:", code);
    try {
      const response = await fetch(`${API_URL}/otp/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: fullPhone, otp: code }),
      });
      const data = await response.json();
      console.log("OTP verification response:", data);
      if (data.message === "OTP verified successfully") {
        setShowVerification(false);
        await loginUser(formData); // Proceed with login
      } else {
        window.alert("Verification failed");
      }
    } catch (error) {
      console.error("Error verifying code: ", error);
      window.alert("Verification failed");
    }
  };

  return (
    <div className="login-form">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          {!showVerification ? (
            <form
              id="login-form"
              method="post"
              className="login-form"
              onSubmit={loginSubmission}
            >
              <h2 id="title" className="mb-4 text-center">
                Login
              </h2>
              <div className="mb-3 d-flex">
                <select
                  className="form-control me-2"
                  value={countryCode}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setCountryCode(e.target.value)
                  }
                  required
                >
                  {Object.entries(countryCodes).map(([country, code]) => (
                    <option key={country} value={code}>
                      {country} ({code})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="form-control abc"
                  placeholder="Enter your number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="d-grid gap-2">
                <button
                  type="submit"
                  id="login-btn"
                  className="btn btn-secondary"
                >
                  Log in
                </button>
                <Link
                  to="/signup"
                  className="an"
                  aria-label="Already have an account?"
                >
                  Signup
                </Link>
              </div>
            </form>
          ) : (
            <Verification
              phone={`${countryCode}${formData.phone}`} // Pass full phone number to the verification component
              onClose={handleVerificationClose}
              onSuccess={handleVerificationSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
