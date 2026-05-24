import * as authService from "./auth.service.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const token = await authService.loginUser(email, password);

  res.status(200).json({
    status: "success",
    token
  });
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await authService.registerUser(name, email, password);

  res.status(201).json({
    status: "success",
    ...user
  });
});