"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useRouter } from "next/navigation";
import api from "../../utils/api";
import Cookies from "js-cookie";
import { toast } from "sonner";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { useMutation, useQueryClient } from "react-query";
import Image from "next/image";

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
      onError: (err) => {
        console.log(err);
        toast("Credenciais inválidas");
      },
    }
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    createSignInMutation.mutate(values);
  };

  return (
    <main className="h-full w-full flex items-center justify-center relative">
      <div className="-z-[5] absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black to-transparent" />
      <Image
        src="/landing-page/pricing-hero.png"
        layout="fill"
        objectFit="cover"
        alt="Main background image"
        className="-z-10  backdrop-blur-md"
        quality={100}
      />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
    </main>
  );
}

export default SignInPage;
