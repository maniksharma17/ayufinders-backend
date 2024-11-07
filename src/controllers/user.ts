import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { userSigninSchema, userSignupSchema } from "../schema/user.js";
import { Request, Response } from "express";
import dotenv from "dotenv"
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

export const signinWithGoogleHandler = async (req: Request, res: Response) => {
  const userPayload = req.body;
  
  const user = await User.findOne({
    email: userPayload.email,
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
      phone: userPayload.phone,
      password: userPayload.password,
      country: userPayload.country
    });

    res.status(200).json({
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