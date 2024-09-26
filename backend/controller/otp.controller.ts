import twilio from "twilio";
import otpGenerator from "otp-generator";
import { Request, Response } from "express";
import mongoose from "mongoose";

import { successResponse, errorResponse } from "./types/response";
import OtpValidate from "../OtpValidate/OtpVaildate";
import OtpModel from "../models/OtpSchema";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const serviceSid = process.env.TWILIO_SERVICE_SID!;
const twilioClient = twilio(accountSid, authToken);

const countryCodes: { [key: string]: string } = {
  Pak: "+92",
  Ind: "+91",
  USA: "+1",
  UK: "+44",
  Can: "+1",
  Aus: "+61",
  Ger: "+49",
  Fra: "+33",
  Ita: "+39",
  Spa: "+34",
  Net: "+31",
  Swe: "+46",
  Jap: "+81",
  Chi: "+86",
  Bra: "+55",
  Mex: "+52",
  UAE: "+971",
  Rus: "+7",
  Nig: "+234",
  Sin: "+65",
};
export const getCountryCodes = (req: Request, res: Response): void => {
  res.status(200).json(countryCodes);
};

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  console.log("Request body:", req.body);
  try {
    const { phone, countryCode } = req.body;
    console.log("countryCode", countryCode);

    if (!countryCode) {
      res.status(400).json(errorResponse("Invalid country code"));
      return;
    }

    let formattedPhone = phone;
    if (!formattedPhone.startsWith(countryCode)) {
      formattedPhone = `${countryCode}${phone.replace(/^0+/, "")}`;
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Set OTP expiration time to 30 minutes
    const otpExpiration = new Date(Date.now() + 30 * 60 * 1000);

    // Send OTP via Twilio
    try {
      const message = await twilioClient.messages.create({
        body: `Your OTP is: ${otp}`,
        to: formattedPhone,
        from: process.env.PHONE_NUMBER,
      });
    } catch (error) {
      console.error("Twilio error:", error);
      res.status(500).json(errorResponse("Failed to send OTP"));
    }

    // Save OTP in the database
    await OtpModel.findOneAndUpdate(
      { phone: formattedPhone },
      { otp, otpExpiration },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Twilio error:", error);
    res.status(500);
    res.status(500).json(errorResponse("An unknown error occurred"));
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, otp } = req.body;
    const formattedPhone = phone.startsWith("+")
      ? phone
      : `+92${phone.slice(1)}`;

    const otpData = await OtpModel.findOne({ phone: formattedPhone, otp });

    if (!otpData) {
      res.status(400).json(errorResponse("You entered the wrong OTP"));
      return;
    }

    const otpExpirationTime = new Date(otpData.otpExpiration).getTime();
    const isOtpExpired = await OtpValidate(otpExpirationTime);

    if (isOtpExpired) {
      res.status(400).json(errorResponse("Your OTP has expired!"));
      return;
    }

    res.status(200).json(successResponse("OTP verified successfully"));
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res
        .status(400)
        .json(errorResponse("Validation error occurred", error.message));
    } else {
      res
        .status(500)
        .json(
          errorResponse("An unknown error occurred during OTP verification")
        );
    }
  }
};
