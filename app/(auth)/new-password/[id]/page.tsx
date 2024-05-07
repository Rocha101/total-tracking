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
import { toast } from "sonner";

import Link from "next/link";
import { useMutation } from "react-query";
import api from "@/app/utils/api";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/password-input";

const formSchema = z.object({
  password: z
    .string({
      required_error: "Senha obrigatória",
    })
    .min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
});

function NewPassword({ params }: { params: { id: string } }) {
  const router = useRouter();
  const token = params.id;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const sendNewPasswordMutation = useMutation(
    (values: z.infer<typeof formSchema>) =>
      api.put(`/recover-password/new-password/${token}`, values),
    {
      onSuccess: (res) => {
        console.log(res.data);
        toast.success("Senha atualizada com sucesso");
        router.push("/sign-in");
      },
      onError: (err) => {
        console.log(err);
        toast.error("Token inválido");
      },
    }
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    sendNewPasswordMutation.mutate(values);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Nova senha</CardTitle>
        <CardDescription>
          Digite sua nova senha e confirme para continuar
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {sendNewPasswordMutation.isLoading ? "Salvando..." : "Salvar"}
            </Button>
            <div className="flex justify-start">
              <Link href="/sign-in" passHref>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 m-0 h-4 text-xs"
                >
                  Voltar
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default NewPassword;
