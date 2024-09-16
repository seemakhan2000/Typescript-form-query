import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
// Twilio configuration
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import signupModel from '../models/signUp';
import loginModel from '../models/loginSchema';
import ReactModel from '../models/schema'
import {OtpValidate} from '../OtpValidate/OtpVaildate'
import OtpModel from '../models/OtpSchema';
import twilio from 'twilio';
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const serviceSid = process.env.TWILIO_SERVICE_SID!;
const twilioClient = twilio(accountSid, authToken);
const otpGenerator = require('otp-Generator');
// // Function to send verification code
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.body;
    console.log('Request body phone:', req.body);
    let formattedPhone = phone;
    if (!formattedPhone.startsWith('+92')) {
      // Assuming phone starts with 0 for local number, strip it and add +92
      formattedPhone = `+92${phone.slice(1)}`;
    }
    console.log('Formatted phone:', formattedPhone);
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Set OTP expiration time (30 minutes in this example)
    const otpExpiration = new Date(Date.now() + 30 * 60 * 1000);
    await OtpModel.findOneAndUpdate(
      {  phone: formattedPhone },
      { otp, otpExpiration },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ success: true, message: 'OTP sent successfully ' + otp });
    console.log('formattedPhone', formattedPhone);
    console.log('process.env.PHONE_NUMBER', process.env.PHONE_NUMBER);

    await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      to:formattedPhone,
      from:process.env.PHONE_NUMBER 
    });

  } catch (error) {
    console.error('Twilio error:', error);
    if (!res.headersSent) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  }
};

//Function to verify code
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, otp } = req.body;
    console.log(" verify phone otp" , req.body)
    const formattedPhone = phone.startsWith('+92') ? phone : `+92${phone.slice(1)}`;
    console.log("Formatted phone for verification:", formattedPhone);
    const otpData = await OtpModel.findOne({ phone: formattedPhone, otp });
    console.log('otpData',otpData)
    if (!otpData) {
      res.status(400).json({ success: false, message: 'You Entered wrong OTP' });
      return;
    }

    // otpExpiration is a Date object and convert it to milliseconds
    const otpExpirationTime = new Date(otpData.otpExpiration).getTime();
    const isOtpExpired = await OtpValidate(otpExpirationTime);

    if (isOtpExpired) {
      res.status(400).json({ success: false, message: 'Your OTP has been expired!' });
      return;
    }

    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to verify verification code', error: error.message });
  }
};






// Function to handle signup without phone number verification
export const signupUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, phone, password } = req.body;
  console.log('Received Data', req.body);
  try {
    const existingUser = await signupModel.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new signupModel({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    const newLoginUser = new loginModel({
  
      username,
      email,
      phone,
      password: hashedPassword,
    });

    await newLoginUser.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
// Function to handle user login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const  {phone,  email, password} = req.body;
    console.log(' login req body', req.body)
    const user = await loginModel.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid password' });
      return;
    }
    const token = jwt.sign(
      { userId: user._id, email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } 

// Function to handle data retrieval
export const getData = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await ReactModel.find();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve data', error });
  }
};

//Function to handle data posting
export const postData = async (req: Request, res: Response): Promise<void> => {
  const formData = req.body;
  try {
    const savedFormData = await ReactModel.create(formData);
    res.json({ message: 'Form data saved successfully', savedFormData });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save form data', error });
  }
};

// Function to handle data deletion
export const deleteData = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const deletedData = await ReactModel.findByIdAndDelete(id);
    res.json({ message: 'Data deleted successfully', deletedData });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete data', error });
  }
};

// Function to handle data updating
export const updateData = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const updatedData = req.body;
  try {
    const updatedDocument = await ReactModel.findByIdAndUpdate(id, updatedData, { new: true });
    res.json({ message: 'Data updated successfully', updatedDocument });
  } catch (error) {
    res.json({ message: 'Failed to update data', error });
  }
};

//Function for protected routes
export const protectedRoute = (req: Request, res: Response): void => {
  res.send('Protected data');
};












