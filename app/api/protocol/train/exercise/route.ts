import prisma from "@/app/utils/prisma";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { verifyAuthorization, verifyToken } from "@/app/utils/auth";

export async function POST(request: NextRequest) {
  try {
    await verifyAuthorization(request);

    const { name, description, sets, reps, totalTime, trainId } =
      await request.json();
    const newExercise = await prisma.exercise.create({
      data: {
        name,
        description,
        sets,
        reps,
        totalTime: totalTime || 0,
        trainId,
      },
    });
    return new Response(JSON.stringify(newExercise), {
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
    const accountId = await verifyAuthorization(request);

    if (!accountId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        headers: { "content-type": "application/json" },
        status: 401,
      });
    }

    const exercises = await prisma.exercise.findMany({
      where: {
        train: {
          protocol: {
            accountId: accountId as string,
          },
        },
      },
    });

    return new Response(JSON.stringify(exercises), {
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
