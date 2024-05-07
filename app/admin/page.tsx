"use client";

import PageHeader from "@/components/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  TbBarbell,
  TbBasketPlus,
  TbBowl,
  TbCopy,
  TbFileAnalytics,
  TbMeat,
  TbPill,
  TbPlus,
  TbUsersPlus,
  TbVaccine,
  TbVaccineBottle,
} from "react-icons/tb";
import Link from "next/link";
import { useCopyToClipboard } from "usehooks-ts";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";

const Dashboard = () => {
  const { account } = useAuth();

  const [copiedText, copy] = useCopyToClipboard();
  const [loadingCopy, setLoadingCopy] = useState(false);
  const referralLink = `iron-atlas.app/sign-up?referral=${account?.account?.id}`;

  const handleCopy = () => {
    console.log("copying");
    setLoadingCopy(true);
    copy(referralLink)
      .then(() => {
        toast.success("Link copiado com sucesso!");
      })
      .catch((error) => {
        console.error("Failed to copy!", error);
        toast.error("Erro ao copiar link!");
      })
      .finally(() => {
        setLoadingCopy(false);
      });
  };

  return (
    <div className="h-full">
      <PageHeader
        title="Seja bem-vindo ao Iron Atlas!"
        description="Aqui você encontra atalhos para as principais ações do sistema."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3">
        {[
          {
            id: 1,
            title: "Nova dieta",
            description: "Crie uma nova dieta",
            icon: TbBasketPlus,
            href: "/admin/diets/new",
          },
          {
            id: 2,
            title: "Nova refeição",
            description: "Crie uma  nova refeição",
            icon: TbBowl,
            href: "/admin/meals/new",
          },
          {
            id: 3,
            title: "Novo alimento",
            description: "Crie um novo alimento",
            icon: TbMeat,
            href: "/admin/foods/new",
          },
          {
            id: 4,
            title: "Novo cliente",
            description: "Copie o link de convite",
            icon: TbUsersPlus,
            hoverIcon: TbCopy,
            action: () => handleCopy(),
          },
          {
            id: 5,
            title: "Novo treino",
            description: "Crie um novo treino",
            icon: TbPlus,
            href: "/admin/trains/new",
          },
          {
            id: 6,
            title: "Novo exercício",
            description: "Crie um novo exercício",
            icon: TbBarbell,
            href: "/admin/exercises/new",
          },
          {
            id: 7,
            title: "Novo protocolo hormonal",
            description: "Crie um novo protocolo",
            icon: TbVaccine,
            href: "/admin/hormonal-protocols/new",
          },
          {
            id: 8,
            title: "Novo hormônio",
            description: "Crie um novo hormônio",
            icon: TbVaccineBottle,
            href: "/admin/hormones/new",
          },
          {
            id: 9,
            title: "Novo suplemento",
            description: "Crie um novo suplemento",
            icon: TbPill,
            href: "/admin/extra-compounds/new",
          },
          {
            id: 10,
            title: "Novo protocolo",
            description: "Crie um novo protocolo",
            icon: TbFileAnalytics,
            href: "/admin/protocols/new",
          },
        ].map(
          (item: {
            id: number;
            title: string;
            description: string;
            icon: any;
            hoverIcon?: any;
            href?: string;
            action?: () => void;
          }) => {
            if (item.href) {
              return (
                <Link key={item.id} href={item.href}>
                  <Card className="flex p-6 items-center justify-between hover:bg-background/25 hover:border-l-4 hover:border-l-primary">
                    <div className="flex flex-col space-y-2">
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    <div className="text-4xl font-bold">
                      {item.hoverIcon ? (
                        <>
                          <item.icon className="h-6 w-6 flex group-hover:hidden" />
                          <item.hoverIcon className="h-6 w-6 hidden group-hover:flex" />
                        </>
                      ) : (
                        <item.icon className="h-6 w-6 flex" />
                      )}
                    </div>
                  </Card>
                </Link>
              );
            } else {
              return (
                <Card
                  key={item.id}
                  className="flex group p-6 items-center justify-between hover:bg-background/25 select-none cursor-pointer border-primary"
                  onClick={item.action}
                >
                  <div className="flex flex-col space-y-2">
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                  <div className="text-4xl font-bold">
                    {item.hoverIcon ? (
                      <>
                        <item.icon className="h-6 w-6 flex group-hover:hidden" />
                        <item.hoverIcon className="h-6 w-6 hidden group-hover:flex" />
                      </>
                    ) : (
                      <item.icon className="h-6 w-6 flex" />
                    )}
                  </div>
                </Card>
              );
            }
          }
        )}
      </div>
    </div>
  );
};

export default Dashboard;
