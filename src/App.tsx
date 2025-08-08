import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { supabase } from "./lib/supabase"; // pastikan path-nya sesuai
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import DataPelakuUsaha from "./pages/DataPelakuUsaha";
import TambahData from "./pages/TambahData";
import EditData from "./pages/EditData";
import NotifikasiPage from "./pages/NotifikasiPage";
import ArtikelPage from "./pages/ArtikelPage";
import TambahArtikel from "./pages/TambahArtikel";
import ViewData from "./pages/ViewData";
import EditArtikel from "./pages/EditArtikel";
import SingleArticlePage from "./pages/SingleArticlePage";
import DaftarAlat from "./pages/DaftarAlat";
import DataPermohonan from "./pages/DataPermohonan";
import { Toaster } from "@/components/ui/sonner";

// Auth context (tanpa username/password manual)
const AuthContext = React.createContext<{
  isAuthenticated: boolean;
  logout: () => void;
}>({
  isAuthenticated: false,
  logout: () => {},
});

export const useAuth = () => React.useContext(AuthContext);

// Route protection
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data-pelaku-usaha"
              element={
                <ProtectedRoute>
                  <DataPelakuUsaha />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tambah-data"
              element={
                <ProtectedRoute>
                  <TambahData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-data/:id"
              element={
                <ProtectedRoute>
                  <EditData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notifikasi"
              element={
                <ProtectedRoute>
                  <NotifikasiPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/artikel"
              element={
                <ProtectedRoute>
                  <ArtikelPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tambah-artikel"
              element={
                <ProtectedRoute>
                  <TambahArtikel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-artikel/:id"
              element={
                <ProtectedRoute>
                  <EditArtikel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/view-data/:id"
              element={
                <ProtectedRoute>
                  <ViewData />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/perpanjang"
              element={
                <ProtectedRoute>
                  <ViewData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/permohonan"
              element={
                <ProtectedRoute>
                  <DataPermohonan />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/alat"
              element={
                <ProtectedRoute>
                  <DaftarAlat />
                </ProtectedRoute>
              }
            />
            <Route path="/artikel/:id" element={<SingleArticlePage />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
