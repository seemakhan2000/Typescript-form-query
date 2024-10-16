import { Router } from "express";

import { userController } from '../controller/user.controller';

import { verifyToken } from "../middleware/token";
const userRouter = Router();

userRouter.get("/get",  userController.getUser);
userRouter.post("/", verifyToken, userController.postUser);
userRouter.delete("/delete/:id", verifyToken, userController.deleteUser);
userRouter.put("/update/:id", verifyToken, userController.updateUser);

userRouter.post("/login", userController.loginUser);
userRouter.post("/signup",userController.signupUser);



export default userRouter;
