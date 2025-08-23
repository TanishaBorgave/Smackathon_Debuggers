import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import AIDoctorChat from "./components/AIDoctorChat";

// Pages
import Home from "./pages/Home";
import DonorRegistration from "./pages/DonorRegistration";
import BloodRequest from "./pages/BloodRequest";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import DonorManagement from "./pages/DonorManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/donate" element={<DonorRegistration />} />
              <Route path="/request" element={<BloodRequest />} />
              <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/inventory" element={<Inventory />} />
                  <Route path="/donor-management" element={<DonorManagement />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <AIDoctorChat />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
