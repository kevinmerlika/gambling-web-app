import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// lib/utils.ts

/**
 * Helper function to safely convert a userId to a number.
 * @param userId - The userId to be converted (from session)
 * @returns The userId as a number, or null if invalid.
 */
export function convertUserIdToNumber(userId: string | number): number | null {
  const userIdAsNumber = typeof userId === 'string' ? parseInt(userId, 10) : userId;

  if (isNaN(userIdAsNumber)) {
    return null; // Return null if the userId is not a valid number
  }

  return userIdAsNumber;
}
