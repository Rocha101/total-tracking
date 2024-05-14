"use client";

import api from "@/app/utils/api";
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
import { useAuth } from "@/context/auth";
import { useMutation } from "react-query";
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
import { useEffect } from "react";
import { TbDeviceFloppy, TbLoader2 } from "react-icons/tb";

const accountUpdateSchema = z.object({
  name: z.string({
    required_error: "Nome obrigatório",
  }),
  email: z
    .string({
      required_error: "Email obrigatório",
    })
    .email({ message: "Email inválido" }),
  password: z
    .string({
      required_error: "Senha obrigatória",
    })
    .min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
});
const SettingsPage = () => {
  const { account } = useAuth();
  const currentAccount = account?.account || null;
  const accountId = currentAccount?.id || "";
  const accountUpdateForm = useForm<Zod.infer<typeof accountUpdateSchema>>({
    resolver: zodResolver(accountUpdateSchema),
  });

  const accountUpdateMutation = useMutation(
    (value) => api.put(`/account/${accountId}`, value),
    {
      onSuccess: (res) => {
        toast.success("Conta atualizada com sucesso");
      },
      onError: (err: any) => {
        console.log(err);
        toast.error("Erro ao atualizar conta");
      },
    }
  );

  const onSubmitAccount = (data: any) => {
    accountUpdateMutation.mutate(data);
  };

  useEffect(() => {
    if (currentAccount !== null) {
      accountUpdateForm.reset({
        name: currentAccount.name || "",
        email: currentAccount.email || "",
        password: currentAccount.password || "",
      });
    }
  }, [currentAccount, accountUpdateForm]);

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
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Form {...accountUpdateForm}>
              <form
                className="flex flex-col gap-4"
                onSubmit={accountUpdateForm.handleSubmit(onSubmitAccount)}
              >
                <FormField
                  control={accountUpdateForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={accountUpdateForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={accountUpdateForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="flex gap-1 items-center">
                  {accountUpdateMutation.isLoading ? (
                    <TbLoader2 className="animate-spin h-4 w-4  mr-2" />
                  ) : (
                    <TbDeviceFloppy className="h-4 w-4 mr-2" />
                  )}
                  {accountUpdateMutation.isLoading ? "Salvando..." : "Salvar"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
