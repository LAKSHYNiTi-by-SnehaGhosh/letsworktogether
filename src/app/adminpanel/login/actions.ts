"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key-please-change-in-production"
);

export async function loginAdmin(email: string, password: string) {
  try {
    if (!email.endsWith("@lakshyniti.com")) {
      return { error: "Unauthorized domain." };
    }

    const admin = await prisma.backendAdmin.findUnique({
      where: { email },
    });

    if (!admin) {
      return { error: "Invalid credentials." };
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      return { error: "Invalid credentials." };
    }

    // Create JWT
    const token = await new SignJWT({ adminId: admin.id, email: admin.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("12h")
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set("lwt_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
    });

    return { success: true };
  } catch (err: any) {
    console.error("Login Error:", err);
    return { error: err?.message || "Server Error" };
  }
}
