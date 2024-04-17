import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TbCheck } from "react-icons/tb";

interface PricingPlanCardProps {
  title: string;
  description: string;
  price: string;
  duration: string;
}

const PricingPlanCard = ({
  title,
  description,
  price,
  duration,
}: PricingPlanCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 ">
        <p className="text-4xl font-semibold text-start">
          {price}
          <span className="text-lg">/{duration}</span>
        </p>
        <Button className="w-full mt-3">Assinar</Button>
        <Separator className="mb-3" />
        <p className="font-semibold leading-none tracking-tight">
          O que está incluso:
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {[
            "Planos de treino personalizados",
            "Planos alimentares personalizados",
            "Protocolos de suplementação",
            "Protocolos hormonais",
            "Suporte 24/7",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <TbCheck className="h-4 w-4 text-primary" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingPlanCard;
