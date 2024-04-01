import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function generateToken(payload: any): string {
  return jwt.sign(payload, "GYM", { expiresIn: "12h" });
}

export function verifyToken(token: string): { accountId: string } {
  try {
    const decoded = jwt.verify(token, "GYM");
    return decoded as { accountId: string };
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid token");
  }
}

export async function verifyAuthorization(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      headers: { "content-type": "application/json" },
      status: 401,
    });
  }

  const { accountId } = verifyToken(token);

  // Only authenticated users can create protocols, so accountId must be present
  if (!accountId) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      headers: { "content-type": "application/json" },
      status: 401,
    });
  }

  return accountId;
}
