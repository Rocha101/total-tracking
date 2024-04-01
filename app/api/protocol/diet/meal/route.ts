import prisma from "@/app/utils/prisma";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, accountType } = await request.json();

    // Check if the email is already registered
    const existingAccount = await prisma.account.findUnique({
      where: {
        email,
      },
    });

    if (existingAccount) {
      return new Response(
        JSON.stringify({ message: "Email already registered" }),
        {
          headers: { "content-type": "application/json" },
          status: 400,
        }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new account
    const newAccount = await prisma.account.create({
      data: {
        email,
        name,
        password: hashedPassword,
        accountType: accountType,
      },
    });

    // Return the newly created account
    return new Response(JSON.stringify(newAccount), {
      headers: { "content-type": "application/json" },
      status: 201,
    });
  } catch (error) {
    console.error("Error registering account:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.account.findMany({});

    return new Response(JSON.stringify(categories), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: e }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}
