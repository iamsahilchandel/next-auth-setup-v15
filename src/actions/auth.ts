'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { registerSchema } from '@/lib/zod';

export type RegisterResponse = {
  user?: {
    id: string;
    name: string | null;
    email: string | null;
  };
  message?: string;
  error?: string | z.ZodError['errors'];
};

export async function registerUser(
  userdata: z.infer<typeof registerSchema>
): Promise<RegisterResponse> {
  try {
    // Validate the input
    const { success, data, error } = registerSchema.safeParse(userdata);

    if (!success) return { error: error.message };

    const { email, password, name } = data;

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return {
        error: 'User already exists',
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      message: 'User registered successfully',
    };
  } catch (error) {
    console.log("[Error (Register User)] Internal Server Error", error)

    return {
      error: 'Internal server error',
    };
  }
}
