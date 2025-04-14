
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import RequesterDashboard from "./pages/RequesterDashboard";
import ApproverDashboard from "./pages/ApproverDashboard";
import NewRequest from "./pages/NewRequest";
import RequestStatus from "./pages/RequestStatus";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              
              {/* Requester Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute userType="requester">
                  <RequesterDashboard />
                </ProtectedRoute>
              } />
              <Route path="/new-request" element={
                <ProtectedRoute userType="requester">
                  <NewRequest />
                </ProtectedRoute>
              } />
              <Route path="/request-status" element={
                <ProtectedRoute userType="requester">
                  <RequestStatus />
                </ProtectedRoute>
              } />
              
              {/* Approver Routes */}
              <Route path="/approve" element={
                <ProtectedRoute userType="approver">
                  <ApproverDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
