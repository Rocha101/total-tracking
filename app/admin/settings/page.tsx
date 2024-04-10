"use client";

import PageHeader from "@/components/page-header";
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
import { useState } from "react";
import { TbCopy, TbEdit, TbLoader2 } from "react-icons/tb";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

const SettingsPage = () => {
  const { account } = useAuth();
  const [copiedText, copy] = useCopyToClipboard();
  const [loadingCopy, setLoadingCopy] = useState(false);

  const handleCopy = (text: string) => () => {
    setLoadingCopy(true);
    copy(text)
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

  const link = `https://total-tracking.com.br/sign-up?ref=${account?.account?.id}`;

  return (
    <div>
      <PageHeader title="Configurações" />
      <div className="flex flex-col gap-3">
        <Card>
          <CardHeader>
            <CardTitle>Informações do usuario</CardTitle>
            <CardDescription>
              Aqui você pode visualizar e alterar as informações do seu usuário.
            </CardDescription>
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
              <div className="flex justify-end mt-5">
                <Button className="w-32 flex gap-3 items-center">
                  Editar <TbEdit className="h-5 w-5" />
                </Button>
              </div>
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
            <div className="flex items-center justify-between">
              <Input
                disabled
                className="border border-primary disabled:opacity-100"
                value={link}
              />
              <Button onClick={handleCopy(link)}>
                {loadingCopy ? (
                  <TbLoader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <TbCopy className="h-5 w-5" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
