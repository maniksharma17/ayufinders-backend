import jwt from "jsonwebtoken";
import { userSigninSchema, userSignupSchema } from "../schema/user.js";
import { Request, Response } from "express";
import dotenv from "dotenv"
import Admin from "../models/admin.js";
dotenv.config()
const jwtsecret = process.env.JWT_SECRET

export const adminSigninHandler = async (req: Request, res: Response) => {
  const userPayload = req.body;
  const isValid = userSigninSchema.safeParse(userPayload);

  if (!isValid.success) {
    res.status(404).json({ success: false, message: "Invalid email or password" });
    return;
  }

  const admin = await Admin.findOne({
    email: userPayload.email,
    password: userPayload.password,
  });

  if (admin) {
    const token = await jwt.sign({ admin }, jwtsecret as string);

    // Set the token in the cookie
    res.setHeader('Set-Cookie', `authToken=${token}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=lax;`);

    res.status(200).json({
      message: "Admin signed in",
      admin: admin,
      token: token,
      success: true
    });
  } else {
    res.status(404).json({
      message: "Incorrect email or password",
      user: null,
      token: null,
      success: false
    });
  }
};

export const adminLogoutHandler = (req: Request, res: Response) => {
  // Clear the authentication cookie
  res.setHeader(
    'Set-Cookie',
    'authToken=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=lax;'
  );
  

  // Send response to confirm logout
  res.status(200).json({ message: 'Logout successful' });
}
