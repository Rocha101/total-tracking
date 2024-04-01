import prisma from "@/app/utils/prisma";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { generateToken } from "@/app/utils/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const account = await prisma.account.findUnique({
      where: {
        email,
      },
    });

    if (!account) {
      return new Response(JSON.stringify({ message: "Account not found" }), {
        headers: { "content-type": "application/json" },
        status: 404,
      });
    }

    const passwordMatch = await bcrypt.compare(password, account.password);

    if (!passwordMatch) {
      return new Response(JSON.stringify({ message: "Invalid password" }), {
        headers: { "content-type": "application/json" },
        status: 401,
      });
    }

    // Generate JWT token
    const token = generateToken({ accountId: account.id });

    // Return the JWT token along with the account data
    return new Response(JSON.stringify({ token, account }), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error authenticating user:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}
