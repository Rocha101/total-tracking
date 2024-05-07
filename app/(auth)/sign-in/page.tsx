"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../../utils/api";
import { toast } from "sonner";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { useMutation } from "react-query";
import { PasswordInput } from "@/components/password-input";

const formSchema = z.object({
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

function SignInPage() {
  const { login } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const createSignInMutation = useMutation(
    (values: z.infer<typeof formSchema>) => api.post("/auth/sign-in", values),
    {
      onSuccess: (res) => {
        console.log(res.data);
        login(res.data);
        toast("Login realizado com sucesso");
      },
      onError: (err: any) => {
        console.log(err);
        toast(
          JSON.parse(err.request.response).error || "Erro ao realizar login"
        );
      },
    }
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    createSignInMutation.mutate(values);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Insira suas credenciais para acessar o sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="exemplo@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Link href="/email-request" passHref>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 m-0 h-4 text-xs"
                >
                  Esqueceu a senha?
                </Button>
              </Link>
            </div>
            <Button type="submit" className="w-full">
              {createSignInMutation.isLoading ? "Entrando..." : "Entrar"}
            </Button>
            <Link href="/sign-up" passHref className="w-full">
              <Button type="button" className="w-full" variant="outline">
                Criar conta
              </Button>
            </Link>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default SignInPage;
