import { Router } from "express";
import { createUser } from "./users.controller";

export const userRoute = Router()

userRoute.post('/', createUser)