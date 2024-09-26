import { Router } from "express";

import {getCountryCodes, sendOtp, verifyOtp } from "../controller/otp.controller";
const otpRouter = Router();

otpRouter.post("/send-otp", sendOtp);
otpRouter.post("/verify-otp", verifyOtp);
otpRouter.get("/country-codes", getCountryCodes);

export default otpRouter;
