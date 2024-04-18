"use client";

import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import ReferralLink from "@/components/referral-link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import formatDate from "@/app/utils/formatData";

const subscriptionSchema = z.object({
  activationId: z.string({
    required_error: "Plano obrigatório",
  }),
});

const SettingsPage = () => {
  const subscriptionForm = useForm<Zod.infer<typeof subscriptionSchema>>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {},
  });
  const { account } = useAuth();
  const accountId = account?.account?.id;

  const subscriptionChangeMutation = useMutation(
    (value) => api.post("/subscription/change", value),
    {
      onSuccess: (res) => {
        console.log(res);
      },
      onError: (err: any) => {
        console.log(err);
        toast("Erro ao realizar checkout");
      },
    }
  );

  const onSubmitSubscription = (data: any) => {
    subscriptionChangeMutation.mutate(data);
  };

  const { data: subscriptionData } = useQuery(
    ["subscription", accountId],
    async () => {
      const res = await api.get(`/subscription/verify/${accountId}`);
      console.log(res);
      return res.data;
    },
    {
      enabled: !!accountId,
    }
  );

  return (
    <div>
      <PageHeader title="Configurações" backlink />
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-[200px] grid grid-cols-2">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="subscription">Assinatura</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
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
                  Compartilhe esse link com seus clientes para que eles possam
                  se cadastrar na plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReferralLink />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="subscription">
          <div className="flex flex-col gap-3">
            <Card className="flex items-center justify-between">
              <CardHeader>
                <CardTitle>Assinatura atual</CardTitle>
                <CardDescription>
                  Aqui você pode visualizar as informações da sua assinatura.
                </CardDescription>
              </CardHeader>
              <CardContent className="w-full flex flex-col space-y-1.5 p-6">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle>{subscriptionData?.plan?.name}</CardTitle>
                    <CardDescription>
                      {subscriptionData?.plan?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      <Label>Preço: {subscriptionData?.plan?.price}</Label>
                      <Label>
                        Expira em:{" "}
                        {formatDate(subscriptionData?.expiresAt || "")}
                      </Label>
                      <Label>
                        Status:{" "}
                        {new Date(subscriptionData?.expiresAt) > new Date()
                          ? "Ativo"
                          : "Expirado"}
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atualizar assinatura</CardTitle>
                <CardDescription>
                  Aqui você pode mudar o plano de assinatura da sua conta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <Form {...subscriptionForm}>
                    <form
                      className="flex flex-col gap-4"
                      onSubmit={subscriptionForm.handleSubmit(
                        onSubmitSubscription
                      )}
                    >
                      <FormField
                        control={subscriptionForm.control}
                        name="activationId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Novo código de ativação</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit">Adicionar</Button>
                    </form>
                  </Form>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
