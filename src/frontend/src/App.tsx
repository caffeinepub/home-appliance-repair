import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { UserRole, useUserRole } from "./hooks/useQueries";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

function AppContent() {
  const [view, setView] = useState("landing");
  const { identity, isInitializing } = useInternetIdentity();
  const { data: role } = useUserRole();

  useEffect(() => {
    if (!isInitializing && identity && view === "landing") {
      if (role === UserRole.admin) {
        setView("admin");
      }
    }
  }, [identity, role, isInitializing, view]);

  const renderView = () => {
    switch (view) {
      case "admin":
        return identity ? (
          <AdminDashboard />
        ) : (
          <LandingPage onNavigate={setView} />
        );
      case "dashboard":
        return identity ? (
          <CustomerDashboard />
        ) : (
          <LandingPage onNavigate={setView} />
        );
      default:
        return <LandingPage onNavigate={setView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header view={view} onNavigate={setView} role={role} />
      <div className="flex-1">{renderView()}</div>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
