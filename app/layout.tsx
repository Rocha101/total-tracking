import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { AppWrapper } from "@/components/app-wrapper";

const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

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
      <body className={roboto.className}>
        <AppWrapper>
          <Suspense>{children}</Suspense>
        </AppWrapper>
      </body>
    </html>
  );
}
