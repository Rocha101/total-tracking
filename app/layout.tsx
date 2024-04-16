import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { AppWrapper } from "@/components/app-wrapper";

const inter = Inter({ display: "swap", subsets: ["latin-ext"] });

export const metadata: Metadata = {
  title: "Total Tracking",
  description:
    "Total tracking é uma plataforma que permite controlar seus protocolos de bodybuilding de forma fácil e rápida.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppWrapper>
          <Suspense>{children}</Suspense>
        </AppWrapper>
      </body>
    </html>
  );
}
