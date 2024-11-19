'use server'

import { prisma } from "@/lib/prisma";
import { convertUserIdToNumber } from "@/lib/utils";

type GetBalanceParams = {
  id: number;  // The username (email) of the user whose balance you want to fetch
};

// In your getBalance function (located at ./src/app/actions/getBalance.ts)
export const getBalance = async ({ id }: { id: number }) => {
  if (!id) {
    throw new Error("Invalid user ID");
  }

  const ids = convertUserIdToNumber(id)
  try {
    // Assuming you use Prisma or another ORM, ensure that the user exists
    const user = await prisma.user.findUnique({
      where: { id: ids },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return { balance: user.balance, chips: user.chips };
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
};


// Function to add balance
export const addBalance = async ({ username, amount }: { username: string; amount: number }) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        balance: {
          increment: amount,  // Increment balance by the specified amount
        },
      },
    });

    return updatedUser.balance;
  } catch (error) {
    console.error('Error adding balance:', error);
    throw new Error('Error adding balance');
  }
};

// Function to deduct balance
export const deductBalance = async ({ username, amount }: { username: string; amount: number }) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        balance: {
          decrement: amount,  // Decrement balance by the specified amount
        },
      },
    });

    return updatedUser.balance;
  } catch (error) {
    console.error('Error deducting balance:', error);
    throw new Error('Error deducting balance');
  }
};
