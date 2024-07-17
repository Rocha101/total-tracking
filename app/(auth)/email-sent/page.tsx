"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { TbArrowLeft } from "react-icons/tb";

function EmailSent() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Email enviado!</CardTitle>
        <CardDescription>Verifique sua caixa de entrada</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <Image
          src="/email-sent.svg"
          width={200}
          height={200}
          alt="Email enviado"
          style={{
            maxWidth: "100%",
            height: "auto"
          }} />
        <div className="w-full flex justify-start mt-2">
          <Link href="/sign-in">
            <Button variant="link" className="p-0 m-0 h-4 text-xs">
              <TbArrowLeft className="mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmailSent;
