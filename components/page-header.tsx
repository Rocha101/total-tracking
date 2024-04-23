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
    <div className="w-full  flex items-center gap-2 mb-2">
      {backlink && (
        <Button onClick={() => router.back()} variant="ghost" size="icon">
          <TbChevronLeft className="w-4 h-4" />
        </Button>
      )}

      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-300/75 ml-0.5 mb-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
