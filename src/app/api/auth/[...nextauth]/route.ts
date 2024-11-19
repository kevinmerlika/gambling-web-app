import { prisma } from '@/lib/prisma';
import NextAuth, { type NextAuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';  // Import bcryptjs for password hashing and validation

// Define custom session type
interface CustomSession extends Session {
  token: JWT;  // Store the full JWT in the session
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',  // Use JWT strategy for session management
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'hello@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            username: credentials.email, // Assuming the username is used as email
          },
        });

        if (!user) {
          console.log("User not found");
          return null;
        }

        const isPasswordValid = credentials.password === user.password; // Keep original password comparison

        if (!isPasswordValid) {
          console.log("Invalid password");
          return null;
        }

        // Return user info including the id only
        return {
          id: user.id + '', // Ensure ID is a string
          email: user.username, // User's email (or username here)
          name: user.username,  // User's name
        };
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      console.log('Session Callback', { session, token });

      // Modify session to include user ID and JWT token
      if (token) {
        (session as CustomSession).user.id = token.id as string; // Include user ID
        (session as CustomSession).token = token;  // Store the JWT token in the session
      }

      return session;
    },
    jwt: ({ token, user }) => {
      console.log('JWT Callback', { token, user });

      // Store user info (id) in token during authentication
      if (user) {
        const u = user as any;
        return {
          ...token,
          id: u.id,  // Store user ID in token
        };
      }
      return token;  // Return the existing token if no new user data
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
