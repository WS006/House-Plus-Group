import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomerService from "./components/CustomerService";
import CookieBanner from "./components/CookieBanner";

// Lazy load page components for code splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Factory = lazy(() => import("./pages/Factory"));
const Team = lazy(() => import("./pages/Team"));
const Services = lazy(() => import("./pages/Services"));
const FAQ = lazy(() => import("./pages/FAQ"));
const News = lazy(() => import("./pages/News"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

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
    const redirect = params.get('redirect');
    const p = params.get('p');
    
    // Handle redirect from 404.html
    if (redirect && redirect !== '') {
      window.history.replaceState(null, '', redirect);
    }
    // Handle old p parameter format
    else if (p && p !== '') {
      window.history.replaceState(null, '', '/' + p);
    }
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
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
        <Route path="/privacy" component={() => <Layout><Privacy /></Layout>} />
        <Route path="/terms" component={() => <Layout><Terms /></Layout>} />
        <Route path="/admin" component={() => <AdminLayout><Admin /></AdminLayout>} />
        <Route path="/404" component={() => <Layout><NotFound /></Layout>} />
        <Route component={() => <Layout><NotFound /></Layout>} />
      </Switch>
    </Suspense>
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
