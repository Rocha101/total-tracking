"use client";

import { Fragment } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { TbMenu } from "react-icons/tb";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

const LandingNavBar = () => {
  return (
    <header className="fixed top-0 w-full z-10 bg-background">
      <div className="container mx-auto px-4 md:px-12 py-4 flex justify-between items-center">
        <p className="text-xl font-bold">Iron Atlas</p>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label="Toggle navigation menu"
            >
              <TbMenu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="h-screen flex flex-col">
            <nav className="grid gap-6 text-lg font-medium p-4">
              <div className="flex flex-col items-start gap-4 mt-12">
                <Link href="/#features">
                  <Button variant={"link"} className="text-white">
                    Funcionalidades
                  </Button>
                </Link>
                <Link href="/#pricing">
                  <Button variant={"link"} className="text-white">
                    Preço
                  </Button>
                </Link>
                <Link href="/#contact">
                  <Button variant={"link"} className="text-white">
                    Contato
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="link" className="text-white">
                    Criar conta
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button variant="link" className="text-white">
                    Entrar
                  </Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        <nav className="hidden md:flex items-center justify-center">
          <div className="flex gap-6">
            <Link href="/#features">
              <Button variant={"link"} className="text-white">
                Funcionalidades
              </Button>
            </Link>
            <Link href="/#pricing">
              <Button variant={"link"} className="text-white">
                Preço
              </Button>
            </Link>
            <Link href="/#contact">
              <Button variant={"link"} className="text-white">
                Contato
              </Button>
            </Link>
          </div>
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/sign-up">
            <Button variant="link" className="text-white">
              Criar conta
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline">Entrar</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingNavBar;
