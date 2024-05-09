import Sidebar from "@/components/sidebar/sidebar";
import { Suspense } from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar isAdmin>
        <Suspense>{children}</Suspense>
      </Sidebar>
    </div>
  );
};

export default AdminLayout;
