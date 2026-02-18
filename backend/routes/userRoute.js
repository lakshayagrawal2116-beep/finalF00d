import express from "express"
import authMiddleware from "../middleware/auth.js";
import { loginUser,registerUser,logoutUser } from "../controllers/userControllers.js";

const userRouter =express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.post("/logout", authMiddleware, logoutUser);


export default userRouter;