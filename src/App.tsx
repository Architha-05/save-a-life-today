
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { DonorDashboard } from "./components/Dashboard/DonorDashboard";
import { RecipientDashboard } from "./components/Dashboard/RecipientDashboard";
import { HospitalDashboard } from "./components/Dashboard/HospitalDashboard";
import { BloodBankDashboard } from "./components/Dashboard/BloodBankDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/donor-dashboard" element={
            <ProtectedRoute requiredUserType="donor">
              <DonorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/recipient-dashboard" element={
            <ProtectedRoute requiredUserType="recipient">
              <RecipientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/hospital-dashboard" element={
            <ProtectedRoute requiredUserType="hospital">
              <HospitalDashboard />
            </ProtectedRoute>
          } />
          <Route path="/bloodbank-dashboard" element={
            <ProtectedRoute requiredUserType="bloodbank">
              <BloodBankDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
