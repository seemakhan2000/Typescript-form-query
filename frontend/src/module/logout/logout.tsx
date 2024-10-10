import React from "react";
import { useNavigate } from "react-router-dom";

import "./logout.css"

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <button onClick={handleLogout} className="btn btn-primary logout">
      Logout
    </button>
  );
};

export default Logout;
