import Sidebar from "@/components/sidebar/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar isAdmin>
        <Suspense>{children}</Suspense>
        <Toaster />
      </Sidebar>
    </div>
  );
};

export default AdminLayout;
