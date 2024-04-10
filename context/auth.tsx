"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import api from "@/app/utils/api";

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
    const verifyToken = async () => {
      try {
        const verify = await api.get("/auth/verify");
        console.log(verify);
      } catch (error: any) {
        console.log(error);
        if (error.request.response.includes("TokenExpiredError")) {
          toast("Faça login para acessar a página");
          Cookies.remove("user");
          Cookies.remove("token");
          setAccount(null);
          return router.push("/sign-in");
        }
      }
    };

    if (token && path.includes("admin")) {
      verifyToken();
    }

    if (!account && user && token) {
      setAccount({
        account: user,
        token: token,
      });
    }
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
