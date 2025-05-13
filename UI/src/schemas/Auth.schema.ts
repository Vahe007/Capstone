import { z, ZodError } from "zod";

export const email = z
  .string()
  .min(1, { message: "Email address is required." })
  .email({ message: "Invalid email address." });

export const password = z
  .string()
  .min(1, { message: "Password is required." })
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/\d/, { message: "Password must contain at least one number." })
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, {
    message: "Password must contain at least one special character.",
  });

export const userName = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores",
  );

export const LoginSchema = z.object({
  userName,
  password,
  rememberMe: z.boolean().optional(),
});

export const SignupSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    email,
    userName,
    password,
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required." }),
    terms: z.boolean().refine((value) => value === true, {
      message: "You must agree to the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export const ResetPasswordSchema = z.object({
  email,
});
