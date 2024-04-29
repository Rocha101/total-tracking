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
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";
import { TbArrowLeft } from "react-icons/tb";

const formSchema = z.object({
  email: z
    .string({
      required_error: "Email obrigatório",
    })
    .email({ message: "Email inválido" }),
});

function EmailRequest() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const sendEmailMutation = useMutation(
    (values: z.infer<typeof formSchema>) =>
      api.post("/recover-password", values),
    {
      onSuccess: (res) => {
        console.log(res.data);
        toast("Email enviado com sucesso");
        router.push("/email-sent");
      },
      onError: (err) => {
        console.log(err);
        toast("Email não encontrado");
      },
    }
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    sendEmailMutation.mutate(values);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Recuperar senha</CardTitle>
        <CardDescription>
          Insira seu email para recuperar sua senha
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

            <Button type="submit" className="w-full">
              {sendEmailMutation.isLoading ? "Enviando..." : "Enviar"}
            </Button>
            <div className="flex justify-start">
              <Link href="/sign-in" passHref>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 m-0 h-4 text-xs"
                >
                  <TbArrowLeft className="mr-2" />
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

export default EmailRequest;
