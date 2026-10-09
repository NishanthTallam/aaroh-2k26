import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  rollNumber: z.string().min(1, "Roll number is required"),
  college: z.string().min(2, "College name is required"),
  department: z.string().min(2, "Department is required"),
  year: z.string().min(1, "Year of study is required"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
