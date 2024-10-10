import { Router } from "express";

import {
  getUser,
  postUser,
  deleteUser,
  updateUser,
  loginUser,
  signupUser
} from "../controller/user.controller";

import { verifyToken } from "../middleware/token";
const userRouter = Router();

userRouter.get("/get",  getUser);
userRouter.post("/", verifyToken, postUser);
userRouter.delete("/delete/:id", verifyToken, deleteUser);
userRouter.put("/update/:id", verifyToken, updateUser);

userRouter.post("/login", loginUser);
userRouter.post("/signup", signupUser);



export default userRouter;
