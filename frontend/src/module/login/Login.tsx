import "./login.css";
import React, { useState, useCallback, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import Verification from "../../component/Verification/verification";
import { sendOtp, verifyOtp } from "../../Services/UserService";

const API_URL = "http://localhost:7007";

interface FormData {
  phone: string;
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ phone: "", email: "", password: "" });
  const [showVerification, setShowVerification] = useState(false);

  const navigate = useNavigate();

  const loginMutation = useMutation(
    async (loginData: FormData) => {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      return response.json();
    },
    {
      onSuccess: (data: any) => {
        if (data.token) {
          // window.alert("Login successful");
          navigate("/form");
        } else {
          window.alert("Login failed");
        }
      },
      onError: (error: any) => {
        console.error("Server side error: ", error);
      },
    }
  );

  const sendCodeMutation = useMutation(
    async (phone: string) => {
      const response = await sendOtp(phone);
      return response;
    },
    {
      onSuccess: () => {
        setShowVerification(true);// Show verification popup
      },
      onError: (error: any) => {
        console.error("Error sending verification code: ", error);
        window.alert("Failed to send verification code");
      },
    }
  );

  const loginSubmission = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      sendCodeMutation.mutate(formData.phone);// Send OTP and show verification popup
    },
    [formData, sendCodeMutation]
  );

  const handleVerificationClose = () => setShowVerification(false);

  const handleVerificationSuccess = async (code: string) => {
  try {
    const response = await verifyOtp(formData.phone, code);// Send OTP and show verification popup
    console.log("Verification response:", response);
    console.log("Phone number:", formData.phone);
    console.log("Verification code:", code)
    if (response.message === "OTP verified successfully") {
      setShowVerification(true);//Hide verification popup
      loginMutation.mutate(formData);
    } else {
      window.alert("Verification failed");
    }
  } catch (error) {
    console.error("Error verifying code: ", error);
    window.alert("Verification failed");
  }
};

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 return (
  <div className="login-form">
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        {!showVerification ? (  // Check if showVerification is false
          <form
            id="login-form"
            method="post"
            className="login-form"
            onSubmit={loginSubmission}
          >
            {/* Login form elements */}
            <h2 id="title" className="mb-4 text">
              Login
            </h2>
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
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
              <small className="text-danger" id="uname-validation"></small>
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
              <small className="text-danger" id="pass-validation"></small>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                defaultChecked
                name="remember"
                id="remember"
              />
              <label className="form-check-label" htmlFor="remember">
                Remember me
              </label>
            </div>
            <div className="d-grid gap-2">
              <button type="submit" id="login-btn" className="btn btn-secondary">
                Log in
              </button>
              <Link to="/signup" className="an" aria-label="Already have an account?">
                Signup
              </Link>
            </div>
          </form>
        ) : (  // Otherwise, show the Verification component
          <Verification
            phone={formData.phone}
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
