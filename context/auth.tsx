"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import api from "@/app/utils/api";
import { useQuery } from "react-query";
import { TbLoader2 } from "react-icons/tb";

interface Account {
  account: {
    id: string;
    email: string;
    name: string;
    role: string;
    coachId: string;
    accountType: string;
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

  const handleTokenError = (error: any) => {
    if (error.request.response.includes("Token inválido")) {
      toast("Faça login para acessar a página");
      logout();
    }
  };

  const verifyRes = useQuery(
    ["verifyToken", account?.token],
    async () => {
      const res = await api.get("/auth/verify");
      return res.data;
    },
    {
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
        handleTokenError(error);
      },
    }
  );

  useEffect(() => {
    if (account === null && accountCookie) {
      setAccount(accountCookie);
    }
  }, [account, accountCookie]);

  if (verifyRes.isLoading) {
    return (
      <div className="w-screen h-screen bg-background flex items-center justify-center">
        <TbLoader2 className="text-primary w-24 h-24 animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
