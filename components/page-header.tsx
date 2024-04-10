import Link from "next/link";
import { Button } from "./ui/button";
import { TbChevronCompactLeft, TbChevronLeft } from "react-icons/tb";

interface PageHeaderProps {
  title: string;
  description?: string;
  backlink?: string;
}

const PageHeader = ({ title, description, backlink }: PageHeaderProps) => {
  return (
    <div className="w-full  flex items-center gap-2 mb-2">
      {backlink && (
        <Link href={backlink} passHref>
          <Button variant="ghost" size="icon">
            <TbChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
      )}

      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-100 ml-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
