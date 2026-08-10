import DashboardGuard from "@/src/components/admin/dashboardLayout";
import SideBar from "@/src/components/admin/sideBar";
//ONLY ADMIN CAN ACCESS DASHBOARD LAYOUT 
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardGuard>
      <div className="flex">
        <SideBar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </DashboardGuard>
  );
}