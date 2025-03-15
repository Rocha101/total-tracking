"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

interface Account {
  account: {
    id: string;
    email: string;
    name: string;
    role: string;
    coachId: string;
    accountType: string;
    accountImageUrl?: string;
    password?: string;
  };
  token: string;
}

interface AuthContextType {
  account: Account | null;
  login: (accountData: Account) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const accountCookie = Cookies.get("account")
    ? JSON.parse(Cookies.get("account") || "{}")
    : null;

  const login = (accountData: Account) => {
    Cookies.set("account", JSON.stringify(accountData));

    setAccount(accountData);
    if (accountData.account.accountType === "COACH") {
      router.push("/admin");
    } else {
      router.push("/app");
    }
  };

  const logout = () => {
    Cookies.remove("account");
    setAccount(null);
    router.push("/sign-in");
  };

  const value = { account, login, logout };

  useEffect(() => {
    if (account === null && accountCookie) {
      setAccount(accountCookie);
    }
  }, [account, accountCookie]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
