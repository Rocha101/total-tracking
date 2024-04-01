// pages/api/protocols.ts

import prisma from "@/app/utils/prisma";
import { NextRequest } from "next/server";
import { verifyToken } from "@/app/utils/auth"; // Assuming you have a function to verify tokens

export async function POST(request: NextRequest) {
  try {
    // Verify token
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

    const { name, description } = await request.json();

    // Create the new protocol
    const newProtocol = await prisma.protocol.create({
      data: {
        name,
        description,
        accountId, // Assign the accountId of the authenticated user to the protocol
      },
    });

    // Return the newly created protocol
    return new Response(JSON.stringify(newProtocol), {
      headers: { "content-type": "application/json" },
      status: 201,
    });
  } catch (error) {
    console.error("Error creating protocol:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        headers: { "content-type": "application/json" },
        status: 401,
      });
    }
    const { accountId } = verifyToken(token);
    const protocols = await prisma.protocol.findMany({
      where: {
        accountId,
      },
    });

    return new Response(JSON.stringify(protocols), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching protocols:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify token
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        headers: { "content-type": "application/json" },
        status: 401,
      });
    }

    const { accountId } = verifyToken(token);

    // Only authenticated users can update protocols, so accountId must be present
    if (!accountId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        headers: { "content-type": "application/json" },
        status: 401,
      });
    }

    const { id, name, description, trainId, dietId, hormonalProtocolId } =
      await request.json();

    const existingProtocol = await prisma.protocol.findUnique({
      where: {
        id,
      },
    });

    if (!existingProtocol) {
      return new Response(JSON.stringify({ message: "Protocol not found" }), {
        headers: { "content-type": "application/json" },
        status: 404,
      });
    }

    // Check if the authenticated user is the owner of the protocol
    if (existingProtocol.accountId !== accountId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        headers: { "content-type": "application/json" },
        status: 401,
      });
    }

    // Update the protocol
    const updatedProtocol = await prisma.protocol.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        ...(trainId && { trains: { connect: { id: trainId } } }),
        ...(dietId && { diets: { connect: { id: dietId } } }),
        ...(hormonalProtocolId && {
          hormonalProtocols: { connect: { id: hormonalProtocolId } },
        }),
      },
    });

    // Return the updated protocol
    return new Response(JSON.stringify(updatedProtocol), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error updating protocol:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}
