import { Router } from "express";
import { createUser, loginUser } from "./users.controller";

export const userRoute = Router()

userRoute.post('/signup', createUser)
userRoute.post('/login', loginUser)