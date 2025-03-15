"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbMoon, TbSun } from "react-icons/tb";
import { DropdownMenuIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenuItem className="flex gap-2" onClick={() => setTheme(
      theme === "light" ? "dark" : "light"
    )}>
      {theme === "light" ? (
        <>
          <TbSun className="size-4" />
          Claro
        </>
      ) : (
        <>
          <TbMoon className="size-4" />
          Escuro
        </>
      )}
    </DropdownMenuItem>
  );
}
