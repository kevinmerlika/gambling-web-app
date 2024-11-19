import NextAuth from "next-auth";

// Extend the NextAuth session with the token and user ID
declare module "next-auth" {
  interface Session {
    user: {
      id: string;  // Add the user ID
      name: string;
      email: string;
      image: string | null;
    };
    token: JWT;  // Add the JWT token to the session
  }
}
