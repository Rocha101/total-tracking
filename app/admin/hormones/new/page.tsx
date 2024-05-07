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
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import Link from "next/link";
import { useMutation } from "react-query";

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

const NewExtraCompound = () => {
  const router = useRouter();
  const form = useForm<Zod.infer<typeof hormoneScheme>>({
    resolver: zodResolver(hormoneScheme),
    defaultValues: {
      unit: "MG",
      hormoneType: "TESTOSTERONE",
    },
  });

  const createHormoneMutation = useMutation(
    (values: Zod.infer<typeof hormoneScheme>) => api.post("/hormone", values),
    {
      onSuccess: (res) => {
        console.log(res);
        toast.success("Hormônio criado com sucesso!");
        router.back();
      },
      onError: (err) => {
        console.log(err);
        toast.error("Erro ao criar Hormônio!");
      },
    }
  );

  const onSubmit = (values: Zod.infer<typeof hormoneScheme>) => {
    const hormone = {
      ...values,
      concentrationUnit: getConcentrationUnit(),
    };

    createHormoneMutation.mutate(hormone);
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

  return (
    <div>
      <PageHeader title="Novo Hormônio" backlink />
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
                      <SelectItem value="TESTOSTERONE">Testosterona</SelectItem>
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
                        placeholder="Ex.: 200"
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
            {createHormoneMutation.isLoading ? "Criando..." : "Criar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewExtraCompound;
