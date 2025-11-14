import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ParcelProvider } from "@/contexts/ParcelContext";
import { Header } from "@/components/Header";
import SearchPage from "./pages/SearchPage";
import ResultsPage from "./pages/ResultsPage";
import ParcelDetailPage from "./pages/ParcelDetailPage";
import AddLandPage from "./pages/AddLandPage";
import MyLandsPage from "./pages/MyLandsPage";
import CouncilPage from "./pages/CouncilPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ParcelProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/parcel/:id" element={<ParcelDetailPage />} />
              <Route path="/add-land" element={<AddLandPage />} />
              <Route path="/my-lands" element={<MyLandsPage />} />
              <Route path="/council" element={<CouncilPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ParcelProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
