import { withAuth } from "next-auth/middleware"

export default withAuth({
  // Matches the pages config in `[...nextauth]`
  
  pages: {
    signIn: "/login",
    error: "/error",
  },
})

export const config = {
    matcher: [
      "/settings",
      "/dashboard",
      "/",
      '/games',
      "/login",
      "/games/:slug",    // Matches any subroute under /games, such as /games/poker, /games/blackjack
    ],
  };