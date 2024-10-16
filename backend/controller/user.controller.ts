import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { successResponse, errorResponse } from "./types/response";
import { validateSignupData } from "../models/signUpValidate";
import ReactModel from "../models/schema";
import SignupModel from "../models/signupModel";
import { getEnvVariable } from "./env";

export class UserController {
  // Method to handle success responses
  private sendSuccessResponse(res: Response,
     message: string,
      data?: any) {
    return res.status(200).json(successResponse(message, data));
  }

  private sendErrorResponse(
    res: Response,
    message: string,
    statusCode: number = 500
  ) {
    return res.status(statusCode).json(errorResponse(message));
  }

  async signupUser(req: Request, res: Response): Promise<void> {
    const { username, email, phone, password } = req.body;

    const { error, value } = validateSignupData(req.body);

    if (error) {
      this.sendErrorResponse(res, "Invalid signup data", 500);
      return;
    }

    try {
      const existingUser = await SignupModel.findOne({ email });

      if (existingUser) {
        this.sendErrorResponse(res, "User already exists", 500);
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new SignupModel({
        username,
        email,
        phone,
        password: hashedPassword,
      });

      await newUser.save();

      this.sendSuccessResponse(res, "Signup successful", newUser);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal Server Error";
      this.sendErrorResponse(res, message);
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { phone, email, password } = req.body;

      const user = await SignupModel.findOne({ email });

      if (!user) {
        this.sendErrorResponse(res, "User not found", 500);
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        this.sendErrorResponse(res, "Invalid password", 500);
        return;
      }

      const jwtSecret = getEnvVariable("JWT_SECRET");
      const token = jwt.sign({ userId: user._id, email }, jwtSecret, {
        expiresIn: "1h",
      });

      this.sendSuccessResponse(res, "Login successful", { token });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      this.sendErrorResponse(res, message);
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const result = await ReactModel.find();
      this.sendSuccessResponse(res, "Data retrieved successfully", result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to retrieve data";
      this.sendErrorResponse(res, message);
    }
  }

  async postUser(req: Request, res: Response): Promise<void> {
    const user = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      this.sendErrorResponse(res, "Unauthorized: No token provided", 500);
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      const savedUser = await ReactModel.create(user);
      this.sendSuccessResponse(res, "User saved successfully", savedUser);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      this.sendErrorResponse(res, message);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const updateUser = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      this.sendErrorResponse(res, "Invalid User ID", 500);
      return;
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      this.sendErrorResponse(res, "Unauthorized: No token provided", 500);
      return;
    }

    try {
      const updatedUser = await ReactModel.findByIdAndUpdate(id, updateUser, {
        new: true,
      });

      if (!updatedUser) {
        this.sendErrorResponse(res, "User not found");
        return;
      }
      this.sendSuccessResponse(res, "Data updated successfully", updatedUser);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      this.sendErrorResponse(res, message);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    if (!id || !mongoose.isValidObjectId(id)) {
      this.sendErrorResponse(res, "Invalid User ID", 500);
      return;
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      this.sendErrorResponse(res, "Unauthorized: No token provided", 500);
      return;
    }

    try {
      const deletedUser = await ReactModel.findByIdAndDelete(id);
      this.sendSuccessResponse(res, "Data deleted successfully", deletedUser);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      this.sendErrorResponse(res, message);
    }
  }
}

export const userController = new UserController();
