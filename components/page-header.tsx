"use client";

import { Button } from "./ui/button";
import { TbChevronLeft } from "react-icons/tb";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  description?: string;
  backlink?: boolean;
}

const PageHeader = ({ title, description, backlink }: PageHeaderProps) => {
  const router = useRouter();
  return (
    <div className="w-full flex items-center gap-2 mb-2">
      {backlink && (
        <Button
          variant="outline"
          type="button"
          onClick={() => router.back()}
          size="minimal"
        >
          <TbChevronLeft className="w-4 h-4" />
        </Button>
      )}

      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-foreground ">{title}</h1>
        {description && (
          <p className="text-sm text-foreground ml-0.5 mb-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
