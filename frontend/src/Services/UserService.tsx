import axios from "axios";

import { FormValue, UserData } from "../component/type/type";

const API_URL = process.env.REACT_APP_API_URL;

const getToken = () => {
  return localStorage.getItem("token");
};

export const addUser = async (userData: FormValue) => {
  if (!getToken()) {
    console.log("No token found, redirecting to login.");
    window.location.href = "/login";
    return;
  }

  try {
    const response = await axios.post(`${API_URL}/user`, userData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Include token in headers
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const fetchUsers = async () => {
  const response = await axios.get<{ data: UserData[] }>(`${API_URL}/user/get`);
  return response.data.data;
};
// Delete User
export const deleteUser = async (id: string) => {
  if (!getToken())
 {
    console.log("No token found, redirecting to login.");
    window.location.href = "/login";
    return;
  }
  try {
    const response = await axios.delete(`${API_URL}/user/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Include token in headers
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Update User
export const updateUser = async (updatedUser: UserData) => {
  if (!getToken()) {
    console.log("No token found, redirecting to login.");
    window.location.href = "/login";
    return;
  }

  try {
    const response = await axios.put(
      `${API_URL}/user/update/${updatedUser._id}`,
      updatedUser,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
