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
import api from "@/app/utils/api";
import { useMutation, useQueryClient } from "react-query";

const foodSchema = object({
  name: string({
    required_error: "Nome é obrigatório",
  }),
  description: string().optional(),
  quantity: number().optional(),
  unit: enumValidator(["GR", "ML", "UNIT"]).optional(),
  calories: number().optional(),
  proteins: number().optional(),
  carbs: number().optional(),
  fats: number().optional(),
});

interface FoodFormProps {
  onSubmitOk?: () => void;
}

const FoodForm = ({ onSubmitOk }: FoodFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<Zod.infer<typeof foodSchema>>({
    resolver: zodResolver(foodSchema),
    defaultValues: {
      unit: "GR",
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
    },
  });
  const MealUnit = [
    { value: "GR", label: "Gramas" },
    { value: "ML", label: "Mililitros" },
    { value: "UNIT", label: "Unidade" },
  ];

  const createFoodMutation = useMutation(
    (values: Zod.infer<typeof foodSchema>) => api.post("/food", values),
    {
      onSuccess: () => {
        toast("Alimento criada com sucesso!");
        if (onSubmitOk) {
          onSubmitOk();
        }
        queryClient.invalidateQueries("foods");
      },
      onError: () => {
        toast("Erro ao criar alimento!");
      },
    }
  );

  const onSubmit = (values: Zod.infer<typeof foodSchema>) => {
    createFoodMutation.mutate(values);
  };

  return (
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
                  placeholder="Nome do alimento Ex.: Batata Doce"
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
                <Input placeholder="Ex.: Cozida" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex gap-1">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex.: 100"
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {MealUnit.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-full flex items-end gap-1">
          <FormField
            control={form.control}
            name="proteins"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Proteínas</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(parseFloat(value));
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carbs"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Carboidratos</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(parseFloat(value));
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fats"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Gorduras</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(parseFloat(value));
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="calories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calorias</FormLabel>
              <FormControl>
                <Input
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
        <Button type="submit" className="w-full">
          {createFoodMutation.isLoading ? "Criando..." : "Criar"}
        </Button>
      </form>
    </Form>
  );
};

export default FoodForm;
