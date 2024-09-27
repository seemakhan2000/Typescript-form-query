import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { successResponse, errorResponse } from "./types/response";
import signupModel from "../models/signUp";
import loginModel from "../models/loginSchema";
import ReactModel from "../models/schema";

export const signupUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, phone, password } = req.body;

  try {
    const existingUser = await signupModel.findOne({ email });

    if (existingUser) {
      res.status(400).json(errorResponse("User already exists"));
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

    res.status(201).json(successResponse("Signup successful"));
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(errorResponse("Internal Server Error", error.message));
    } else {
      res.status(500).json({ message: "Unknown Error" });
    }
  }
  
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  console.log("loginUser", loginUser);
  try {
    const { phone, email, password } = req.body;
    const user = await loginModel.findOne({ email });
    if (!user) {
      res.status(400).json(errorResponse("User not found"));
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json(errorResponse("Invalid password"));
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      res.status(500).json(errorResponse("JWT_SECRET is not defined"));
      return;
    }

    const token = jwt.sign(
      { userId: user._id, email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

     res.status(200).json(successResponse("Login successful", { token }));
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(errorResponse("Internal server error", error.message));
    } else {
      res.status(500).json(errorResponse("Internal server error", "Unknown error"));
    }
  }
};

export const getData = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await ReactModel.find();
    res.status(200).json(successResponse("Data retrieved successfully", result));
  }catch (error) {
    if (error instanceof Error) {
      res.status(500).json(errorResponse("Failed to retrieve data", error.message));
    } else {
      res.status(500).json(errorResponse("Failed to retrieve data", "Unknown error"));
    }
  }
};

export const postData = async (req: Request, res: Response): Promise<void> => {
  const formData = req.body;
  try {
    const savedFormData = await ReactModel.create(formData);
    res.status(201).json(successResponse("Form data saved successfully", savedFormData));
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(errorResponse("Failed to save form data", error.message));
    } else {
      res.status(500).json(errorResponse("Failed to save form data", "Unknown error"));
    }
  }
};

export const deleteData = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;
  try {
    const deletedData = await ReactModel.findByIdAndDelete(id);
    res.status(200).json(successResponse("Data deleted successfully", deletedData));
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(errorResponse("Failed to delete data", error.message));
    } else {
      res.status(500).json(errorResponse("Failed to delete data", "Unknown error"));
    }
  }
};

export const updateData = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;
  const updatedData = req.body;
  try {
    const updatedDocument = await ReactModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    res.status(200).json(successResponse("Data updated successfully", updatedDocument));
  }  catch (error) {
    if (error instanceof Error) {
      res.status(500).json(errorResponse("Failed to update data", error.message));
    } else {
      res.status(500).json(errorResponse("Failed to update data", "Unknown error"));
    }
  }
};

export const protectedRoute = (req: Request, res: Response): void => {
  res.send(successResponse("Protected data"));
};
