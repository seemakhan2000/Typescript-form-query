import { Router } from "express";

import {
  getData,
  postData,
  deleteData,
  updateData,
  loginUser,
  signupUser,
  protectedRoute,
} from "../controller/user.controller";

import { verifyToken } from "../middleware/token";
const userRouter = Router();

userRouter.get("/get", getData);
userRouter.post("/", postData);
userRouter.delete("/delete/:id", deleteData);
userRouter.put("/update/:id", updateData);

userRouter.post("/login", loginUser);
userRouter.post("/signup", signupUser);

userRouter.get("/protected", verifyToken, protectedRoute);

export default userRouter;
