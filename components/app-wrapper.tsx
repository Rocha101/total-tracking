"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "./ui/toaster";

const queryClient = new QueryClient();

export const AppWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
};
