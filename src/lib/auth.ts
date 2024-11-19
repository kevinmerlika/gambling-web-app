import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import NextAuth, { getServerSession } from 'next-auth/next';
 

export const auth = () => getServerSession(authOptions)