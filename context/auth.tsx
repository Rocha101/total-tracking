"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface Account {
  account: {
    email: string;
    name: string;
    role: string;
    id: string;
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
  const path = usePathname();
  const [account, setAccount] = useState<Account | null>(null);
  const user = JSON.parse(Cookies.get("user") || "[]");
  const token = Cookies.get("token");

  const login = (accountData: Account) => {
    Cookies.set("user", JSON.stringify(accountData.account));
    Cookies.set("token", accountData.token);
    setAccount(accountData);
    router.push("/admin");
  };

  const logout = () => {
    Cookies.remove("user");
    Cookies.remove("token");
    setAccount(null);
    router.push("/sign-in");
  };

  const value = { account, login, logout };

  useEffect(() => {
    if (!account && user && token) {
      return setAccount({
        account: user,
        token: token,
      });
    }
    if (!account && path.includes("admin")) {
      toast("Faça login para acessar a página");
      router.push("/sign-in");
    }
    if (account && path.includes("sign-in")) router.push("/admin");
  }, [account, router, path, user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
