import Link from "next/link";
import { TbBarbell } from "react-icons/tb";

const TopBar = () => {
  return (
    <div className="h-14 flex gap-1 justify-start items-center bg-background ml-14 w-[calc(100%-theme(space.14))] px-3 border-b">
      <TbBarbell className="h-6 w-6" />
      <h1 className="text-lg font-bold tracking-wide ">Iron Atlas</h1>
    </div>
  );
};

export default TopBar;
