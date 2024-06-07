import "@/styles/globals.css"
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { SessionProvider } from "next-auth/react";
import Main from "@/app/main";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>)  {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
    <link rel="icon" href="/favicon.ico" sizes="any" />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
      <SessionProvider>
      <Main>{children}</Main>
      </SessionProvider>
      </body>
    </html>
  )
}
