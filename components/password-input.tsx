import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { TbEye, TbEyeClosed } from "react-icons/tb";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    "use client";
    const [show, setShow] = React.useState(false);

    return (
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        <Button
          size="minimal"
          variant="ghost"
          type="button"
          className="h-7 w-7 absolute right-1 top-1"
          onClick={() => setShow(!show)}
        >
          {show ? (
            <TbEyeClosed className="h-4 w-4" />
          ) : (
            <TbEye className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
