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
        console.log(res);
        toast("Hormônio editado com sucesso!");
        router.back();
      },
      onError: (err) => {
        console.log(err);
        toast("Erro ao editar Hormônio!");
      },
    }
  );

  const onSubmit = (values: Zod.infer<typeof hormoneScheme>) => {
    const hormone = {
      ...values,
      concentrationUnit: getConcentrationUnit(),
    };

    updateHormoneMutation.mutate(hormone);
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
    console.log(unit);
    if (unit === "UNIT") {
      form.setValue("concentration", 0);
    }
    if (unit === "MG" || unit === "ML") {
      form.setValue("concentration", 0);
    }
  }, [form, unit]);

  useEffect(() => {
    if (hormone) {
      (
        [
          "name",
          "description",
          "quantity",
          "unit",
          "concentration",
          "concentrationUnit",
          "hormoneType",
        ] as Array<keyof Hormone>
      ).forEach((key) => {
        if (hormone[key] !== undefined || hormone[key] !== null)
          form.setValue(key as any, hormone[key]);
      });
    }
  }, [hormone, form]);

  return (
    <div>
      <PageHeader title="Editar Hormônio" backlink />
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
                  <Input placeholder="Enantato de testosterona" {...field} />
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
                  <Input placeholder="" {...field} />
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
                      <SelectItem value="TESTOSTERONE">Testosterona</SelectItem>
                      <SelectItem value="PEPTIDE">Peptídeo</SelectItem>
                      <SelectItem value="INSULIN">Insulina</SelectItem>
                      <SelectItem value="TIREOID">Tireoide</SelectItem>
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
                      placeholder="10"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(parseFloat(value));
                      }}
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
                      <SelectTrigger>
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
                        placeholder="10"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(parseFloat(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Unidade</FormLabel>
                <FormControl>
                  <Input value={concentrationUnit} disabled />
                </FormControl>
              </FormItem>
            </div>
          )}

          <Button type="submit" className="w-full">
            {updateHormoneMutation.isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditHormonePage;
