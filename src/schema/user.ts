import z from "zod"

export const userSignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export const userSigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})