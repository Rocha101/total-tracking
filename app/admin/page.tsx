"use client";

import PageHeader from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "react-query";
import api from "../utils/api";
import {
  TbBarbell,
  TbBasket,
  TbBasketBolt,
  TbBasketPlus,
  TbCirclePlus,
  TbLoader2,
  TbMeat,
  TbPlus,
  TbUsersPlus,
  TbVaccine,
} from "react-icons/tb";
import Link from "next/link";
import { useCopyToClipboard } from "usehooks-ts";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";

const Dashboard = () => {
  const { account } = useAuth();
  const { isLoading: ClientsLoading, data: ClientsCount } = useQuery(
    "clientsCount",
    async () => {
      const res = await api.get("/dashboard/clientsCount");
      console.log(res);
      return res.data;
    }
  );

  const { isLoading: ProtocolsLoading, data: ProtocolsCount } = useQuery(
    "protocolsCount",
    async () => {
      const res = await api.get("/dashboard/protocolCount");
      console.log(res);
      return res.data;
    }
  );

  const [copiedText, copy] = useCopyToClipboard();
  const [loadingCopy, setLoadingCopy] = useState(false);
  const referralLink = `iron-atlas.app/sign-up?referral=${account?.account?.id}`;

  const handleCopy = () => {
    console.log("copying");
    setLoadingCopy(true);
    copy(referralLink)
      .then(() => {
        toast("Link copiado com sucesso!");
      })
      .catch((error) => {
        console.error("Failed to copy!", error);
        toast("Erro ao copiar link!");
      })
      .finally(() => {
        setLoadingCopy(false);
      });
  };

  return (
    <div className="h-full">
      <PageHeader
        title="Seja bem-vindo ao painel de administração"
        description="Aqui você pode acompanhar as metricas dos seus protocolos e clientes"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <Card className="flex p-6 items-center justify-between">
          <div className="flex flex-col space-y-2">
            <CardTitle>Clientes</CardTitle>
            <CardDescription>
              Quantidade de clientes cadastrados
            </CardDescription>
          </div>
          <div className="text-4xl font-bold">
            {ClientsLoading ? (
              <TbLoader2 className="h-10 w-10 animate-spin" />
            ) : (
              ClientsCount
            )}
          </div>
        </Card>

        <Card className="flex p-6 items-center justify-between">
          <div className="flex flex-col space-y-2">
            <CardTitle>Protocolos</CardTitle>
            <CardDescription>
              Quantidade de protocolos cadastrados
            </CardDescription>
          </div>
          <div className="text-4xl font-bold">
            {ProtocolsLoading ? (
              <TbLoader2 className="h-10 w-10 animate-spin" />
            ) : (
              ProtocolsCount
            )}
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3">
        {[
          {
            id: 1,
            title: "Novo treino",
            description: "Crie um novo treino para o cliente",
            icon: TbPlus,
            href: "/admin/trains/new",
          },
          {
            id: 2,
            title: "Nova dieta",
            description: "Crie uma nova dieta para o cliente",
            icon: TbBasketPlus,
            href: "/admin/diets/new",
          },
          {
            id: 3,
            title: "Novo protocolo hormonal",
            description: "Crie um novo protocolo hormonal",
            icon: TbVaccine,
            href: "/admin/hormonal-protocols/new",
          },
          {
            id: 4,
            title: "Novo cliente",
            description: "Copie o link de convite",
            icon: TbUsersPlus,
            action: () => handleCopy(),
          },
        ].map((item) => {
          if (item.href) {
            return (
              <Link key={item.id} href={item.href}>
                <Card className="flex p-6 items-center justify-between hover:bg-background/25">
                  <div className="flex flex-col space-y-2">
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                  <div className="text-4xl font-bold">
                    <item.icon className="h-6 w-6" />
                  </div>
                </Card>
              </Link>
            );
          } else {
            return (
              <Card
                key={item.id}
                className="flex p-6 items-center justify-between hover:bg-background/25 select-none cursor-pointer border-primary"
                onClick={item.action}
              >
                <div className="flex flex-col space-y-2">
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
                <div className="text-4xl font-bold">
                  <item.icon className="h-6 w-6" />
                </div>
              </Card>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Dashboard;
