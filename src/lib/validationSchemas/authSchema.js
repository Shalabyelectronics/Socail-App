import * as z from "zod";
import NotFound from "./../../pages/NotFound/NotFound";

export const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty("Name is required")
      .min(3, "Chars not less than 3 charectors")
      .max(5, "Chars not exceed 5 charectors"),
    email: z.string().nonempty("Email is required").email("Invalid email"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(4, "Password not less than 4 digts")
      .max(8, "Password not exceed 8 digits"),
    rePassword: z.string().nonempty("Password is required"),
    dateOfBirth: z.preprocess(
      (value) =>
        value && typeof value.toString === "function" ? value.toString() : "",
      z
        .string()
        .nonempty("Date of birth is required")
        .refine((userDate) => {
          const userYear = new Date(userDate).getFullYear();
          const currentYear = new Date().getFullYear();
          const age = currentYear - userYear;
          return age >= 18;
        }, "Your age must be 18 or above"),
    ),
    gender: z.string().nonempty("Gender is required"),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Passwords not matched",
  });

export const loginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid Email"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(4, "Password not less than 4 digts")
    .max(8, "Password not exceed 8 digits"),
});
