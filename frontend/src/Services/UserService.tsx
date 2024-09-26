import axios from "axios";

import { FormValue, UserData } from "../component/Types/Types";

const API_URL = "http://localhost:7007";

export const addUser = async (userData: FormValue) => {
  const response = await axios.post(`${API_URL}/user`, userData);
  return response.data;
};

export const fetchUsers = async () => {
  const response = await axios.get<UserData[]>(`${API_URL}/user/get`);
  return response.data;
};

export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/user/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const updateUser = async (updatedUser: UserData) => {
  try {
    const response = await axios.put(
      `${API_URL}/user/update/${updatedUser._id}`,
      updatedUser
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const sendOtp = async (phone: string, country: string): Promise<any> => {
  console.log("phone number", phone, "country", country);
  try {
    const response = await axios.post(`${API_URL}/otp/send-otp`, {
      phone,
      country,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
    } else if (error instanceof Error) {
      console.error("Error Message:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    window.alert("An error occurred. Please try again.");
    throw error;
  }
};

export const verifyOtp = async (phone: string, code: string) => {
  try {
    const response = await axios.post(`${API_URL}/otp/verify-otp`, {
      phone,
      otp: code,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying code:", error);
    throw error;
  }
};
