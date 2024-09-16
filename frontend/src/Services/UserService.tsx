
import axios from 'axios';
import { FormValue, UserData } from "../component/Types/Types";

const API_URL = 'http://localhost:7007';

// In UserService.ts
export const addUser = async (userData: FormValue) => {
  const response = await axios.post(`${API_URL}`, userData);
  return response.data;
};


export const fetchUsers = async () => {
  const response = await axios.get<UserData[]>(`${API_URL}/get`);
  return response.data;
};

export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updateUser = async (updatedUser: UserData) => {
  try {
    const response = await axios.put(`${API_URL}/update/${updatedUser._id}`, updatedUser);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const sendOtp = async (phone: string) => {
  console.log("phone number", phone)
  try {

    const response = await axios.post(`${API_URL}/send-otp`, { phone});
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      console.error('Data:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
    } else if (error instanceof Error) {
      // Handle general errors
      console.error('Error Message:', error.message);
    } else {
      // Handle unknown errors
      console.error('Unexpected error:', error);
    }
    window.alert("An error occurred. Please try again.");
    throw error;
  }
};
export const verifyOtp = async (phone: string, code: string) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, { phone, otp: code });
    return response.data;
  } catch (error) {
    console.error('Error verifying code:', error);
    throw error;
  }
};















// /* These functions encapsulate the communication between your frontend React application and your 
// backend server, allowing you to perform data operations seamlessly. Adjust the endpoints 
// (/users, /delete, /update) and API_URL as per your backend API design.*/