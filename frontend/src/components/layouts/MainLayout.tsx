import * as React from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarComponent } from "@/components/SidebarComponent";
import { HeaderComponent } from "@/components/HeaderComponent";

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider className="h-screen w-screen overflow-hidden">
      <SidebarComponent />
      <SidebarInset className="flex flex-col h-full overflow-y-auto bg-uts-main">
        <HeaderComponent />
        <main className="flex-1 p-8 max-w-[2000px] w-full mx-auto flex flex-col gap-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
