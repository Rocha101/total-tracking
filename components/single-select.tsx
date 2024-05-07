"use client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Item {
  id: string;
  name: string;
}

interface SingleSelectProps {
  options: Item[];
  handleSelect: (id: string) => void;
  selectedOption: Item | undefined;
  add?: boolean;
}

const SingleSelect: React.FC<SingleSelectProps> = ({
  options,
  selectedOption,
  handleSelect,
  add,
}) => {
  "use client";

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-full">
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between bg-transparent",
            add && "rounded-tr-none rounded-br-none"
          )}
        >
          {selectedOption?.name || "Selecione um item..."}
          <CaretSortIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0">
        <Command className="w-full">
          <CommandInput placeholder="Buscar items..." className="h-9" />
          <CommandList className="w-full">
            <CommandEmpty>Nenhum Item Encontrado</CommandEmpty>
            <CommandGroup className="w-full">
              {options.length > 0 &&
                options.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={() => handleSelect(item.id)}
                  >
                    <CheckIcon
                      className={
                        "h-4 w-4 mr-2 " +
                        (selectedOption?.id === item.id
                          ? "opacity-100"
                          : "opacity-0")
                      }
                    />
                    {item.name}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SingleSelect;
