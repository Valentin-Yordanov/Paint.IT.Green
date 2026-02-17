import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Compete from "./pages/Compete";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
//import NotFound from "./pages/NotFound";
import OurGoal from "./pages/OurGoal";
import OurCommunity from "./pages/OurCommunity";
import OurImpact from "./pages/OurImpact";
import OurValues from "./pages/OurValues";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const queryClient = new QueryClient();

const FooterWrapper = () => {
  const location = useLocation();
  if (location.pathname === "/community") return null;
  return <Footer />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* 1. MOVE BrowserRouter HERE (Top Level) */}
    <BrowserRouter>
      <ThemeProvider>
        {/* 2. Now LanguageProvider is inside the Router */}
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />

            {/* 3. AuthProvider is also inside the Router */}
            <AuthProvider>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/compete" element={<Compete />} />
                <Route path="/community" element={<Community />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/our-goal" element={<OurGoal />} />
                <Route path="/our-community" element={<OurCommunity />} />
                <Route path="/our-impact" element={<OurImpact />} />
                <Route path="/our-values" element={<OurValues />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {/* <Route path="*" element={<NotFound />} /> */}
              </Routes>
              <FooterWrapper />
            </AuthProvider>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
