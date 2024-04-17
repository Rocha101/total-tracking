"use client";

import PageHeader from "@/components/page-header";
import ReferralLink from "@/components/referral-link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth";
import { TbEdit } from "react-icons/tb";

const SettingsPage = () => {
  const { account } = useAuth();

  return (
    <div>
      <PageHeader title="Configurações" backlink />
      <div className="flex flex-col gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-col space-y-1.5">
              <CardTitle>Informações do usuario</CardTitle>
              <CardDescription>
                Aqui você pode visualizar e alterar as informações do seu
                usuário.
              </CardDescription>
            </div>

            <Button size="sm" className="flex gap-1 items-center">
              <TbEdit className="h-3 w-3" /> Editar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Label>Nome</Label>
              <Input disabled value={account?.account?.name} />
              <Label>Email</Label>
              <Input disabled value={account?.account?.email} />
              <Label>Tipo da conta</Label>
              <Input disabled value={account?.account?.accountType} />
              <Label>Senha</Label>
              <Input disabled value="********" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Link para filiar novos clientes</CardTitle>
            <CardDescription>
              Compartilhe esse link com seus clientes para que eles possam se
              cadastrar na plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReferralLink />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
