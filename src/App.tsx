import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HomePage } from "@/pages/HomePage";
import { AboutPage } from "@/pages/AboutPage";
import { GalleryPage } from "@/pages/GalleryPage";
import { ContactPage } from "@/pages/ContactPage";
import { ConnectPage } from "@/pages/ConnectPage";
import { AdminDashboard } from "@/pages/AdminDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isAdmin = pathname === "/link" || pathname.startsWith("/link/");

  if (isAdmin) {
    return <div className="min-h-screen bg-[#faf8f5]">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#1c1b18] antialiased selection:bg-[#1c1b18] selection:text-[#faf8f5]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LayoutWrapper>
        <Routes>
          {/* Public Front Door */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Hidden Admin Dashboard Route (Bento Grid) */}
          <Route path="/link" element={<AdminDashboard />} />
          <Route path="/admin" element={<Navigate to="/link" replace />} />

          {/* Form redirects to unified Connect page */}
          <Route path="/prayer" element={<Navigate to="/connect?tab=prayer" replace />} />
          <Route path="/giving" element={<Navigate to="/connect?tab=giving" replace />} />
          
          <Route path="*" element={<HomePage />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;
