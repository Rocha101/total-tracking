"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TbDeviceFloppy, TbLoader2 } from "react-icons/tb";
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
import { object, string, number, enum as enumValidator, infer } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useMutation, useQuery } from "react-query";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import Hormone from "../../hormones";
import { useEffect } from "react";
import getConcentrationUnit from "@/app/utils/getConcentrationUnit";

const hormoneScheme = object({
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
  hormoneType: enumValidator([
    "NINETEEN_NOR",
    "DHT",
    "TESTOSTERONE",
    "PEPTIDE",
    "INSULIN",
    "TIREOID",
  ]),
});

const EditHormonePage = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const hormoneId = params.id;
  const router = useRouter();
  const form = useForm<Zod.infer<typeof hormoneScheme>>({
    resolver: zodResolver(hormoneScheme),
    defaultValues: {
      unit: "MG",
      hormoneType: "TESTOSTERONE",
    },
  });

  const updateHormoneMutation = useMutation(
    (values: Zod.infer<typeof hormoneScheme>) =>
      api.put(`/hormone/${hormoneId}`, values),
    {
      onSuccess: (res) => {
        toast.success("Hormônio atualizado com sucesso!");
        router.back();
      },
      onError: (err) => {
        console.log(err);
        toast.error("Erro ao Atualizar Hormônio!");
      },
    }
  );

  const onSubmit = (values: Zod.infer<typeof hormoneScheme>) => {
    const hormone = {
      ...values,
      concentrationUnit: getConcentrationUnitByUnit(),
    };

    updateHormoneMutation.mutate(hormone);
  };

  const getConcentrationUnitByUnit = (): "MG" | "MG_ML" | undefined => {
    switch (form.watch("unit")) {
      case "ML":
        return "MG_ML";
      case "UNIT":
        return "MG";
      default:
        return undefined;
    }
  };

  const concentrationUnit = getConcentrationUnitByUnit();

  const { data: hormone } = useQuery(
    ["exercise", hormoneId],
    async () => {
      const res = await api.get<Hormone>(`/hormone/${hormoneId}`);
      return res.data;
    },
    {
      enabled: !!hormoneId,
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
    if (hormone) {
      if (hormone.name) form.setValue("name", hormone.name);
      if (hormone.description)
        form.setValue("description", hormone.description);
      if (hormone.quantity) form.setValue("quantity", hormone.quantity);
      if (hormone.unit) form.setValue("unit", hormone.unit);
      if (hormone.hormoneType)
        form.setValue("hormoneType", hormone.hormoneType);

      if (hormone.concentration) {
        form.setValue("concentrationUnit", hormone.concentrationUnit);
        setTimeout(() => {
          form.setValue("concentration", hormone.concentration);
        }, 100);
      }
    }
  }, [hormone, form]);

  return (
    <>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-2">
            <PageHeader title="Atualizar Hormônio" backlink />
            <Button type="submit">
              {updateHormoneMutation.isLoading ? (
                <TbLoader2 className="animate-spin h-4 w-4  mr-2" />
              ) : (
                <TbDeviceFloppy className="h-4 w-4 mr-2" />
              )}
              {updateHormoneMutation.isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>

          <Card className="">
            <CardHeader>
              <CardTitle>Detalhes do hormônio</CardTitle>
              <CardDescription>Informações básicas do hormônio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex.: Enantato de testosterona"
                        {...field}
                      />
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
                      <Input placeholder="Ex.: Intramuscular" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hormoneType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NINETEEN_NOR">19-Nor</SelectItem>
                          <SelectItem value="DHT">DHT</SelectItem>
                          <SelectItem value="TESTOSTERONE">
                            Testosterona
                          </SelectItem>
                          <SelectItem value="PEPTIDE">Peptídeo</SelectItem>
                          <SelectItem value="INSULIN">Insulina</SelectItem>
                          <SelectItem value="TIREOID">Tireoidiano</SelectItem>
                        </SelectContent>
                      </Select>
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
                            placeholder="Ex.: 200"
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
                        className="rounded-tl-none rounded-bl-none  border-l-0"
                        value={getConcentrationUnit(concentrationUnit)}
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
    </>
  );
};

export default EditHormonePage;
