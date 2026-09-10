import { useState, useEffect } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import MotherCareClinic from "@/components/MotherCareClinic";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

function AdminRoute() {
  const { loading, session } = useAdminAuth();
  const hash = useHashRoute();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F9F9", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ fontSize: 15, color: "#5C7480" }}>Loading...</div>
      </div>
    );
  }

  if (hash.startsWith("#/admin/dashboard")) {
    if (!session) {
      window.location.hash = "#/admin";
      return null;
    }
    return <AdminDashboard />;
  }

  if (hash.startsWith("#/admin")) {
    if (session) {
      window.location.hash = "#/admin/dashboard";
      return null;
    }
    return <AdminLogin />;
  }

  return <MotherCareClinic />;
}

function App() {
  return (
    <LanguageProvider>
      <AdminAuthProvider>
        <AdminRoute />
      </AdminAuthProvider>
    </LanguageProvider>
  );
}

export default App;
