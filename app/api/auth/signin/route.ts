import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/db/prismadb";
import {
  verifyPassword,
  createSession,
  cleanupExpiredSessions,
} from "@/lib/auth/auth";
import { z } from "zod";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = signinSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 },
      );
    }

    const { email, password } = validationResult.data;

    // Find user
    const user = await prismadb.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Verify password
    const isValidPassword = user.passwordHash
      ? await verifyPassword(password, user.passwordHash)
      : false;

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const store = await prismadb.store.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        name: "My Store",
        userId: user.id,
      },
    });

    // Clean up expired sessions for this user
    await cleanupExpiredSessions();

    // Create session
    const token = await createSession(user.id, user.email);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      storeId: store.id,
    });
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 });
  }
}
