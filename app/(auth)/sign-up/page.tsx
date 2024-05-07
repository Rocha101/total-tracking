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
import { IssueData, z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../utils/api";
import { toast } from "sonner";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import Link from "next/link";
import { useMutation } from "react-query";
import Image from "next/image";
import { PasswordInput } from "@/components/password-input";

const formSchema = z
  .object({
    name: z.string({
      required_error: "Nome obrigatório",
    }),
    accountType: z.enum(["CUSTOMER", "COACH"]),
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
    coachId: z
      .string({
        required_error: "Código do coach obrigatório",
      })
      .optional(),
    activationKey: z
      .string({
        required_error: "Chave de ativação obrigatória",
      })
      .optional(),
  })
  .superRefine((data, refinementContext) => {
    if (data.accountType === "COACH" && !data.activationKey) {
      return refinementContext.addIssue({
        path: ["activationKey"],
        message: "Chave de ativação obrigatória",
        code: "invalid_literal",
      } as IssueData);
    }
    if (data.accountType === "CUSTOMER" && !data.coachId) {
      return refinementContext.addIssue({
        path: ["coachId"],
        message: "Código do coach obrigatório",
        code: "invalid_literal",
      } as IssueData);
    }
    return true;
  });

function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const coachId = searchParams.get("referral");
  console.log(coachId);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const createSignUpMutation = useMutation(
    (values: z.infer<typeof formSchema>) => api.post("/auth/sign-up", values),
    {
      onSuccess: (res) => {
        console.log(res.data);
        toast.success("Registro realizado com sucesso");
        router.push("/sign-in");
      },
      onError: (err) => {
        console.log(err);
        toast.error("Credenciais inválidas");
      },
    }
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    createSignUpMutation.mutate(values);
  };

  useEffect(() => {
    if (coachId) {
      setTimeout(() => {
        form.setValue("coachId", coachId);
        form.setValue("accountType", "CUSTOMER");
      }, 100);
    } else {
      setTimeout(() => {
        form.setValue("accountType", "COACH");
      }, 100);
    }
  }, [coachId, form]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Criar conta</CardTitle>
        <CardDescription>
          Preencha os campos abaixo para criar sua conta
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="exemplo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de conta</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!!coachId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">Cliente</SelectItem>
                        <SelectItem value="COACH">Coach</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("accountType") === "COACH" && (
              <FormField
                control={form.control}
                name="activationKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chave de ativação</FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    <Link
                      target="_blank"
                      href="https://wa.me/5548998280420?text=Ol%C3%A1%21+Estou+interessado+em+adquirir+uma+assinatura+do+Iron+Atlas.+Poderia+me+informar+sobre+os+planos+dispon%C3%ADveis+e+como+proceder+para+ativ%C3%A1-los%3F"
                      className="text-xs font-medium leading-none hover:underline"
                    >
                      Quero adquirir uma chave de ativação
                    </Link>
                  </FormItem>
                )}
              />
            )}
            {form.watch("accountType") === "CUSTOMER" && !coachId && (
              <FormField
                control={form.control}
                name="coachId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código do coach</FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full">
              {createSignUpMutation.isLoading ? "Salvando..." : "Salvar"}
            </Button>
            <Link href="/sign-in" passHref className="w-full">
              <Button type="button" className="w-full" variant="outline">
                Já tem uma conta? Faça login
              </Button>
            </Link>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default SignUpPage;
