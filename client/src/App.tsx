import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomerService from "./components/CustomerService";
import CookieBanner from "./components/CookieBanner";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Factory from "./pages/Factory";
import Team from "./pages/Team";
import Services from "./pages/Services";
import FAQ from "./pages/FAQ";
import News from "./pages/News";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CustomerService />
      <CookieBanner />
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function Router() {
  // GitHub Pages SPA routing fix
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p');
    if (p && p !== '') {
      // Restore the original path
      window.history.replaceState(null, '', '/' + p);
    }
  }, []);

  return (
    <Switch>
      <Route path="/" component={() => <Layout><Home /></Layout>} />
      <Route path="/about" component={() => <Layout><About /></Layout>} />
      <Route path="/products" component={() => <Layout><Products /></Layout>} />
      <Route path="/products/:id" component={() => <Layout><ProductDetail /></Layout>} />
      <Route path="/factory" component={() => <Layout><Factory /></Layout>} />
      <Route path="/team" component={() => <Layout><Team /></Layout>} />
      <Route path="/services" component={() => <Layout><Services /></Layout>} />
      <Route path="/faq" component={() => <Layout><FAQ /></Layout>} />
      <Route path="/news" component={() => <Layout><News /></Layout>} />
      <Route path="/careers" component={() => <Layout><Careers /></Layout>} />
      <Route path="/contact" component={() => <Layout><Contact /></Layout>} />
      <Route path="/admin" component={() => <AdminLayout><Admin /></AdminLayout>} />
      <Route path="/404" component={() => <Layout><NotFound /></Layout>} />
      <Route component={() => <Layout><NotFound /></Layout>} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
