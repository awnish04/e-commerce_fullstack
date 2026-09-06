import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/db/prismadb";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production",
);

const SESSION_COOKIE_NAME = "session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export interface SessionPayload {
  userId: string;
  email: string;
  expiresAt: Date;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSession(
  userId: string,
  email: string,
): Promise<string> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  // Create JWT token
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(JWT_SECRET);

  // Store session in database
  await prismadb.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  // Set cookie
  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

export async function verifySession(
  token?: string,
): Promise<SessionPayload | null> {
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  }

  if (!token) {
    return null;
  }

  try {
    // Verify JWT
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as { userId: string; email: string };

    // Check if session exists in database and is not expired with timeout
    const session = (await Promise.race([
      prismadb.session.findUnique({
        where: { token },
        include: { user: true },
      }),
      new Promise(
        (_, reject) =>
          setTimeout(() => reject(new Error("Database timeout")), 30000), // Increased to 30 seconds
      ),
    ])) as any;

    if (!session || session.expiresAt < new Date()) {
      // Clean up expired session (don't wait for it)
      if (session) {
        prismadb.session
          .delete({ where: { id: session.id } })
          .catch(console.error);
      }
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      expiresAt: session.expiresAt,
    };
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    // Delete from database
    await prismadb.session.deleteMany({
      where: { token },
    });

    // Delete cookie
    cookieStore.delete(SESSION_COOKIE_NAME);
  }
}

export async function getCurrentUser() {
  const session = await verifySession();

  if (!session) {
    return null;
  }

  const user = await prismadb.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

// Middleware helper to verify session from request
export async function verifySessionFromRequest(
  request: NextRequest,
): Promise<SessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return verifySession(token);
}

// Helper to update response with new session cookie
export function setSessionCookie(
  response: NextResponse,
  token: string,
  expiresAt: Date,
): NextResponse {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return response;
}

// Clean up expired sessions (run periodically or on login)
export async function cleanupExpiredSessions(): Promise<void> {
  await prismadb.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}
