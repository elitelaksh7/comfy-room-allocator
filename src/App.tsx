import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1">
        <header className="sticky top-0 z-10 h-14 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 flex items-center px-4">
          <SidebarTrigger />
          <div className="ml-4">
            <h2 className="text-sm font-semibold text-foreground">Hostel Room Allocation System</h2>
          </div>
        </header>
        {children}
      </main>
    </div>
  </SidebarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/students" element={<AppLayout><ComingSoon /></AppLayout>} />
          <Route path="/rooms" element={<AppLayout><ComingSoon /></AppLayout>} />
          <Route path="/requests" element={<AppLayout><ComingSoon /></AppLayout>} />
          <Route path="/vacancy" element={<AppLayout><ComingSoon /></AppLayout>} />
          <Route path="/export" element={<AppLayout><ComingSoon /></AppLayout>} />
          <Route path="/payments" element={<AppLayout><ComingSoon /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><ComingSoon /></AppLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
