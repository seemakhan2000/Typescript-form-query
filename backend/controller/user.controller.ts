import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { successResponse, errorResponse } from "./types/response";
import { validateSignupData } from "../models/signUpValidate";
import ReactModel from "../models/schema";
import SignupModel from "../models/signupModel";
import { getEnvVariable } from "./env";

export const signupUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, phone, password } = req.body;

  const { error, value } = validateSignupData(req.body);

  if (error) {
    res
      .status(500)
      .json(errorResponse("Invalid signup data", error.details[0].message));
    return;
  }

  try {
    const existingUser = await SignupModel.findOne({ email });

    if (existingUser) {
      res.status(500).json(errorResponse("User already exists"));
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

    res.status(201).json(successResponse("Signup successful"));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json(errorResponse(message));
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, email, password } = req.body;

    const user = await SignupModel.findOne({ email });

    if (!user) {
      res.status(500).json(errorResponse("User not found"));
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(500).json(errorResponse("Invalid password"));
      return;
    }

    const jwtSecret = getEnvVariable("JWT_SECRET");
    const token = jwt.sign({ userId: user._id, email }, jwtSecret, {
      expiresIn: "1h",
    });

    res.status(200).json(successResponse("Login successful", { token }));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json(errorResponse(message));
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await ReactModel.find();
    res
      .status(200)
      .json(successResponse("Data retrieved successfully", result));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to retrieve data";
    res.status(500).json(errorResponse(message));
  }
};

export const postUser = async (req: Request, res: Response): Promise<void> => {
  const user = req.body;

  // Verify token
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(500).json(errorResponse("Unauthorized: No token provided"));
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    const savedUser = await ReactModel.create(user);
    res.status(201).json(successResponse("User saved successfully", savedUser));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
    return;
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;
  const updateUser = req.body;

  // Check if the ID is valid
  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(500).json(errorResponse("Invalid User ID"));
    return;
  }

  // Verify token
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(500).json(errorResponse("Unauthorized: No token provided"));
    return;
  }

  try {
    const updatedUser = await ReactModel.findByIdAndUpdate(id, updateUser, {
      new: true,
    });

    res
      .status(200)
      .json(successResponse("Data updated successfully", updatedUser));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update data";
    res.status(500).json(errorResponse(message));
  }
};

// Delete User
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;

  // Check if the ID is valid
  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(500).json(errorResponse("Invalid User ID"));
    return;
  }

  // Verify token
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(500).json(errorResponse("Unauthorized: No token provided"));
    return;
  }

  try {
    const deletedUser = await ReactModel.findByIdAndDelete(id);

    res
      .status(200)
      .json(successResponse("Data deleted successfully", deletedUser));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete data";
    res.status(500).json(errorResponse(message));
  }
};
