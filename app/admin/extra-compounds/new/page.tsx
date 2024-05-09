"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TbDeviceFloppy, TbLoader2 } from "react-icons/tb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, number, enum as enumValidator, infer } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import Link from "next/link";
import { useMutation } from "react-query";
import { useEffect } from "react";

const extraCompoundSchema = object({
  name: string({
    required_error: "Nome é obrigatório",
  }),
  description: string().optional(),
  quantity: number({
    required_error: "Quantidade é obrigatória",
  }),
  concentration: number().optional(),
  unit: enumValidator(["MG", "ML", "UI", "UNIT"]),
  concentrationUnit: enumValidator(["MG_ML", "MG"]).optional(),
});

const NewExtraCompound = () => {
  const router = useRouter();
  const form = useForm<Zod.infer<typeof extraCompoundSchema>>({
    resolver: zodResolver(extraCompoundSchema),
    defaultValues: {
      unit: "MG",
    },
  });

  const createCompoundMutation = useMutation(
    (values: Zod.infer<typeof extraCompoundSchema>) =>
      api.post("/extraCompound", values),
    {
      onSuccess: (res) => {
        toast.success("Composto criado com sucesso!");
        router.back();
      },
      onError: (err) => {
        console.log(err);
        toast.error("Erro ao criar Composto!");
      },
    }
  );

  const onSubmit = (values: Zod.infer<typeof extraCompoundSchema>) => {
    const extraCompound = {
      ...values,
      concentrationUnit: getConcentrationUnit(),
    };

    createCompoundMutation.mutate(extraCompound);
  };

  const unit = form.watch("unit");

  useEffect(() => {
    if (unit === "UNIT") {
      form.setValue("concentration", 0);
    }
    if (unit === "MG" || unit === "ML") {
      form.setValue("concentration", 0);
    }
  }, [form, unit]);

  const getConcentrationUnit = (): "MG" | "MG_ML" | undefined => {
    switch (form.watch("unit")) {
      case "ML":
        return "MG_ML";
      case "UNIT":
        return "MG";
      default:
        return undefined;
    }
  };

  const concentrationUnit = getConcentrationUnit();

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-2">
            <PageHeader title="Novo Composto" backlink />
            <Button type="submit">
              {createCompoundMutation.isLoading ? (
                <TbLoader2 className="animate-spin h-4 w-4  mr-2" />
              ) : (
                <TbDeviceFloppy className="h-4 w-4 mr-2" />
              )}
              {createCompoundMutation.isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>

          <Card className="">
            <CardHeader>
              <CardTitle>Detalhes do composto</CardTitle>
              <CardDescription>Informações básicas do composto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: Vitamina K2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex.: Pela Manhã em Jejum"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex.: 10"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(parseFloat(value));
                          }}
                          className="rounded-tr-none rounded-br-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger className="rounded-tl-none rounded-bl-none border-l-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MG">MG</SelectItem>
                            <SelectItem value="ML">ML</SelectItem>
                            <SelectItem value="UI">UI</SelectItem>
                            <SelectItem value="UNIT">UNIDADE</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {concentrationUnit && (
                <div className="flex">
                  <FormField
                    control={form.control}
                    name="concentration"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Concentração</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex.: 100"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(parseFloat(value));
                            }}
                            className="rounded-tr-none rounded-br-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-tl-none rounded-bl-none border-l-0"
                        value={concentrationUnit}
                        disabled
                      />
                    </FormControl>
                  </FormItem>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default NewExtraCompound;
