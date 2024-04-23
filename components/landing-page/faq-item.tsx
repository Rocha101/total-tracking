"use client";

import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface FaqProps {
  id: number;
  question: string;
  answer: string;
}

const FaqItem = ({ id, question, answer }: FaqProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-full rounded-md border bg-card"
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between space-x-4 px-4 py-3">
          <h3 className="text-lg font-semibold hover:underline hover:cursor-pointer select-none">
            {question}
          </h3>

          <Button size="icon" variant="link" className="text-white">
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 transition-transform",
                open ? "transform rotate-180" : "transform rotate-0"
              )}
            />
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 py-6">
        <p>{answer}</p>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FaqItem;
