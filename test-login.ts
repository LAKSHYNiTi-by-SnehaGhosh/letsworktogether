import { prisma } from "./src/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key-please-change-in-production"
);

async function testLogin() {
  try {
    const email = "social@lakshyniti.com";
    const password = "password"; // just to test prisma query

    console.log("Fetching admin...");
    const admin = await prisma.backendAdmin.findUnique({
      where: { email },
    });
    console.log("Admin found:", admin);

    if (admin) {
      console.log("Comparing password...");
      const isValid = await bcrypt.compare(password, admin.passwordHash);
      console.log("Password valid:", isValid);
      
      console.log("Signing JWT...");
      const token = await new SignJWT({ adminId: admin.id, email: admin.email })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("12h")
        .sign(JWT_SECRET);
      console.log("JWT generated.");
    }
  } catch (error) {
    console.error("Caught error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
