// pages/api/lobby/deductChips.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';  // Ensure you have prisma instance imported
import { getSession } from 'next-auth/react'; // To access session
import { convertUserIdToNumber } from '@/lib/utils'; // Import the helper function
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { deductBalance } from '@/store/balanceSlice';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { chipsToDeduct } = await request.json(); // Get the chips to deduct from the request body

    // Get session to identify the user
    const session = await getServerSession(authOptions); // Using getServerSession with authOptions
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Convert userId to number using the helper function
    const userId = convertUserIdToNumber(session.user.id);
    if (userId === null) {
      return new NextResponse(JSON.stringify({ error: 'Invalid user ID' }), { status: 400 });
    }

    // Get the current balance of the user from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Check if the user has enough chips to deduct
    if (user.balance < chipsToDeduct) {
      return new NextResponse(JSON.stringify({ error: 'Insufficient chips' }), { status: 400 });
    }

    // Deduct chips from the user's balance
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance: user.balance - chipsToDeduct },
    });

    return new NextResponse(JSON.stringify({ message: 'Chips deducted successfully', updatedUser }), { status: 200 });
  } catch (error) {
    console.error('Error deducting chips:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export default deductBalance;
