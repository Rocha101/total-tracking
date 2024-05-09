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
import { object, string, number, enum as enumValidator } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { useMutation } from "react-query";
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
  protocolId: string().optional(),
  accountId: string().optional(),
});

const NewHormone = ({ isDialog }: { isDialog?: boolean }) => {
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
      concentrationUnit: getConcentrationUnitByUnit(),
    };

    createHormoneMutation.mutate(hormone);
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

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {!isDialog && (
            <div className="flex items-center gap-2">
              <PageHeader title="Novo Hormônio" backlink />
              <Button type="submit">
                {createHormoneMutation.isLoading ? (
                  <TbLoader2 className="animate-spin h-4 w-4  mr-2" />
                ) : (
                  <TbDeviceFloppy className="h-4 w-4 mr-2" />
                )}
                {createHormoneMutation.isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          )}

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

          {isDialog && (
            <Button type="submit" className="w-full">
              {createHormoneMutation.isLoading ? (
                <TbLoader2 className="animate-spin h-4 w-4  mr-2" />
              ) : (
                <TbDeviceFloppy className="h-4 w-4 mr-2" />
              )}
              {createHormoneMutation.isLoading
                ? "Salvando..."
                : "Salvar Hormônio"}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default NewHormone;
