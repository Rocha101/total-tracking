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
import { object, string, number, enum as enumValidator } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery } from "react-query";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { useEffect } from "react";
import ExtraCompounds from "../../extra-compounds";

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
  protocolId: string().optional(),
  accountId: string().optional(),
});

const EditHormonePage = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const extraCompoundId = params.id;
  const router = useRouter();
  const form = useForm<Zod.infer<typeof extraCompoundSchema>>({
    resolver: zodResolver(extraCompoundSchema),
    defaultValues: {
      unit: "MG",
      description: "",
      concentration: 0,
      quantity: 0,
    },
  });

  const updateCompoundMutation = useMutation(
    (values: Zod.infer<typeof extraCompoundSchema>) =>
      api.put(`/extraCompound/${extraCompoundId}`, values),
    {
      onSuccess: (res) => {
        toast.success("Composto atualizado com sucesso!");
        router.back();
      },
      onError: (err) => {
        console.log(err);
        toast.error("Erro ao Atualizar Composto!");
      },
    }
  );

  const onSubmit = (values: Zod.infer<typeof extraCompoundSchema>) => {
    const hormone = {
      ...values,
      concentrationUnit: getConcentrationUnit(),
    };

    console.log(hormone);

    updateCompoundMutation.mutate(hormone);
  };

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

  const { data: extraCompound } = useQuery(
    ["extraCompound", extraCompoundId],
    async () => {
      const res = await api.get<ExtraCompounds>(
        `/extraCompound/${extraCompoundId}`
      );

      return res.data;
    },
    {
      enabled: !!extraCompoundId,
    }
  );

  const unit = form.watch("unit");

  useEffect(() => {
    if (unit === "UNIT") {
      form.setValue("concentration", 0);
    }
    if (unit === "MG" || unit === "ML") {
      form.setValue("concentration", 0);
    }
  }, [form, unit]);

  useEffect(() => {
    if (extraCompound) {
      if (extraCompound.name) form.setValue("name", extraCompound.name);
      if (extraCompound.description)
        form.setValue("description", extraCompound.description);
      if (extraCompound.quantity)
        form.setValue("quantity", extraCompound.quantity);
      if (extraCompound.unit) form.setValue("unit", extraCompound.unit);

      if (extraCompound.concentration) {
        form.setValue("concentrationUnit", extraCompound.concentrationUnit);
        setTimeout(() => {
          form.setValue("concentration", extraCompound.concentration);
        }, 100);
      }
    }
  }, [extraCompound, form]);

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-2">
            <PageHeader title="Atualizar Composto" backlink />
            <Button type="submit">
              {updateCompoundMutation.isLoading ? (
                <TbLoader2 className="animate-spin h-4 w-4  mr-2" />
              ) : (
                <TbDeviceFloppy className="h-4 w-4 mr-2" />
              )}
              {updateCompoundMutation.isLoading ? "Salvando..." : "Salvar"}
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
                            placeholder="Ex.: 100"
                            type="number"
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

export default EditHormonePage;
