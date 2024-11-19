import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { auth } from "@/lib/auth";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(request: NextRequest) {


  try {

    // If session exists, fetch games from the database
    const games = await prisma.games.findMany();

    // Return the list of games as a JSON response
    return NextResponse.json(games);

  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching games:', error);

    // Return an error response if something goes wrong
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch games' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
