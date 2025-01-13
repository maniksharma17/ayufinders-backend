import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { userSigninSchema, userSignupSchema } from "../schema/user.js";
import { Request, Response } from "express";
import dotenv from "dotenv"
import Admin from "../models/admin.js";
dotenv.config()
const jwtsecret = process.env.JWT_SECRET


export const signinHandler = async (req: Request, res: Response) => {
  const userPayload = req.body;
  const isValid = userSigninSchema.safeParse(userPayload);

  if (!isValid.success) {
    res.json({ message: "Invalid email or password" });
    return;
  }

  const user = await User.findOne({
    email: userPayload.email,
    password: userPayload.password,
  });

  if (user) {
    const token = await jwt.sign({ user }, jwtsecret as string);

    res.status(200).json({
      message: "User signed in",
      user: user,
      token: token,
    });
  } else {
    res.status(200).json({
      message: "Incorrect email or password",
      user: null,
      token: null,
    });
  }
};


export const signupHandler = async (req: Request, res: Response) => {
  const userPayload = req.body;
  const isValid = userSignupSchema.safeParse(userPayload);

  if (!isValid.success) {
    res.json({ message: "Invalid email or password" });
    return;
  }

  const userExists = await User.findOne({
    email: userPayload.email,
  });

  if (!userExists) {
    const user = await User.create({
      name: userPayload.name,
      email: userPayload.email,
      password: userPayload.password,
    });

    res.status(201).json({
      message: "User created",
      user: user,
    });
  } else {
    res.status(200).json({
      message: "User exists",
      user: null,
    });
  }
};

export const adminSigninHandler = async (req: Request, res: Response) => {
  const userPayload = req.body;
  const isValid = userSigninSchema.safeParse(userPayload);

  if (!isValid.success) {
    res.json({ message: "Invalid email or password" });
    return;
  }

  const admin = await Admin.findOne({
    email: userPayload.email,
    password: userPayload.password,
  });

  if (admin) {
    const token = await jwt.sign({ admin }, jwtsecret as string);

    // Set the token in the cookie
    res.setHeader('Set-Cookie', `authToken=${token}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Lax`);

    res.status(200).json({
      message: "Admin signed in",
      admin: admin,
      token: token,
    });
  } else {
    res.status(200).json({
      message: "Incorrect email or password",
      user: null,
      token: null,
    });
  }
};

export const adminLogoutHandler = (req: Request, res: Response) => {
  // Clear the authentication cookie
  res.clearCookie('authToken', {
    httpOnly: true, // Ensure the cookie is not accessible via JavaScript
    secure: true,   // Ensure the cookie is sent only over HTTPS
    sameSite: 'strict', // Protect against CSRF attacks
    path: '/', // Apply to all paths
  });

  // Send response to confirm logout
  res.status(200).json({ message: 'Logout successful' });
}
