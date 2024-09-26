import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import otpRouter from "./router/otp.router";
import userRouter from "./router/user.router";
import connectDB from "./connectMongoDB/db";
import  {getCountryCodes } from "./controller/otp.controller";

const app = express();
const port = process.env.PORT || 7007;

app.use(cors());

app.use(express.json());

app.use("/otp", otpRouter);
app.use("/user", userRouter);
app.use("/", getCountryCodes);
connectDB();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
