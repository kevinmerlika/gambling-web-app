// app/layout.tsx
import { Providers } from "@/providers/storeProvider";
import Sidebar from './components/Sidebar';
import TestComponent from "./components/testComponent";
import './globals.css';
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Session, getServerSession } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextAuthProvider } from "@/providers/providers";
import { SettingsProvider } from "@/providers/settingsProvider";
import { redirect } from "next/dist/client/components/redirect";
import { getToken } from "next-auth/jwt";
import { log } from "console";
import { Redirect } from "next";
import { NextResponse } from "next/server";
import Navbar from "./components/navbar/navbar";
import SearchResults from "./components/searchResults";
import { auth } from "@/lib/auth";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  const id = session?.token.id
 
  return (
    <html lang="en">
      <Providers>
        <SettingsProvider>
          <NextAuthProvider>
            <body className="bg-gray-900">
            {session?.user && (
                <div className="flex w-1/4">
      <Navbar ids={id} /> {/* Pass session as props */}
                </div>
              )}
            
            <div className="flex">
              {/* Conditionally render Sidebar if session exists */}

              <SearchResults />

              {session?.user && (
                <div className="flex w-1/5">
                  <Sidebar />
                </div>
              )}
              <div className={`flex-1 p-4 ${session?.user ? 'ml-1/4' : ''}`}>
                {/* Main Content */}
                {children}
              </div>
              </div>
            </body>
          </NextAuthProvider>
        </SettingsProvider>
      </Providers>
    </html>
  );
}