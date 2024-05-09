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

  const updateHormoneMutation = useMutation(
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
      <PageHeader title="Atualizar Composto" backlink />
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
                  <Input placeholder="Ex.: Pela Manhã em Jejum" {...field} />
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
                        placeholder="Ex.: 100"
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
