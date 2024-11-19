// pages/api/lobby/transferBalanceToChips.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';  // Ensure you have prisma instance imported
import { getSession } from 'next-auth/react'; // To access session
import { convertUserIdToNumber } from '@/lib/utils'; // Import the helper function
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { balanceToTransfer } = await request.json(); // Get the balance to transfer to chips

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

    // Check if the user has enough balance to transfer
    if (user.balance < balanceToTransfer) {
      return new NextResponse(JSON.stringify({ error: 'Insufficient balance' }), { status: 400 });
    }

    // Transfer balance to chips
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: user.balance - balanceToTransfer, // Deduct balance
        chips: user.chips + balanceToTransfer, // Add to chips
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: 'Balance transferred to chips successfully',
        updatedUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error transferring balance to chips:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

