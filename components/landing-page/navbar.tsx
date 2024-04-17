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

const LandingNavBar = () => {
  return (
    <header className="fixed top-0 w-full z-10 bg-card/40">
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
              <NavigationMenu>
                <NavigationMenuList className="flex flex-col items-start gap-4 mt-12">
                  <NavigationMenuItem>
                    <NavigationMenuLink href="/#features">
                      Funcionalidades
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink href="/#pricing">
                      Preço
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink href="/#contact">
                      Contato
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink href="/sign-in">
                      Entrar
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </SheetContent>
        </Sheet>

        <nav className="hidden md:flex items-center justify-center">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink href="/#features">
                  Funcionalidades
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/#pricing">Preço</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/#contact">
                  Contato
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/sign-in">Entrar</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>
    </header>
  );
};

export default LandingNavBar;
