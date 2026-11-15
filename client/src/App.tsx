import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLocation, Route, Switch } from "wouter";
import { useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomerService from "./components/CustomerService";
import CookieBanner from "./components/CookieBanner";
import { applyRouteSeo } from "./lib/seo";
import {
  getLoadedPage,
  isChunkLoadError,
  loadPage,
  pageForPath,
  reloadForStaleChunk,
  resetPageLoad,
  type PageModule,
  type PageName,
} from "./lib/pages";

/**
 * How long a client-side navigation waits for its route chunk before giving up
 * and offering a retry. Matches the boot deadline in main.tsx.
 */
const LOAD_TIMEOUT_MS = 8000;

/**
 * Renders a code-split page and owns its loading/error states.
 *
 * An earlier version threw the import promise and let a single <Suspense> above
 * the router catch it. That boundary sat *outside* the layout, so while a route
 * chunk was downloading the navbar, footer and page all disappeared and were
 * replaced by a full-screen spinner — on a slow Nigerian mobile connection that
 * blank window lasted seconds. Loading the module in an effect instead keeps the
 * layout mounted and confines the wait (and any failure) to the content area.
 *
 * The module is read synchronously on first render, so the route that main.tsx
 * preloaded — or one whose chunk is already cached — renders with no spinner at
 * all, straight over the prerendered markup.
 */
function Page({ name }: { name: PageName }) {
  const [module, setModule] = useState<PageModule | undefined>(() => getLoadedPage(name));
  const [status, setStatus] = useState<"loading" | "failed">("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (module) return;

    let cancelled = false;
    setStatus("loading");

    // A request that never settles (stalled mobile connection, captive portal,
    // proxy that swallows the response) never rejects, so without a deadline
    // the spinner below would spin forever.
    const deadline = setTimeout(() => {
      if (cancelled) return;
      resetPageLoad(name);
      setStatus("failed");
    }, LOAD_TIMEOUT_MS);

    loadPage(name).then(
      (loaded) => {
        if (cancelled) return;
        clearTimeout(deadline);
        setModule(loaded);
      },
      (error) => {
        if (cancelled) return;
        clearTimeout(deadline);
        // A rejected import must not stay cached, or Retry would re-render the
        // same failure without issuing a new request.
        resetPageLoad(name);
        // A chunk that vanished under a cached page is fixed by reloading once.
        if (isChunkLoadError(error) && reloadForStaleChunk()) return;
        setStatus("failed");
      }
    );

    return () => {
      cancelled = true;
      clearTimeout(deadline);
    };
  }, [name, module, attempt]);

  if (module) {
    const Component = module.default;
    return <Component />;
  }

  if (status === "failed") {
    return <PageLoadError onRetry={() => setAttempt((n) => n + 1)} />;
  }

  return <PageLoader />;
}

/**
 * In-content wait indicator.
 *
 * Deliberately not full-screen: the navbar and footer stay visible so the
 * visitor can navigate away instead of staring at a page that may never load.
 */
function PageLoader() {
  return (
    <div className="flex items-center justify-center py-32" role="status" aria-live="polite">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      <span className="sr-only">Loading page…</span>
    </div>
  );
}

/** Shown when a route chunk could not be downloaded, with a way to recover. */
function PageLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex items-center justify-center py-28 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-xl font-bold text-foreground mb-3">This page didn't load</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Your connection dropped, or the site was updated while this tab was open.
          Try again — if it keeps happening, please{" "}
          <a className="underline" href="/contact/">
            contact us
          </a>
          .
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
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
  const [location] = useLocation();

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

  // Keep title / description / canonical / structured data in sync on
  // client-side navigation. Without this, every SPA route change keeps the
  // metadata of the page that was loaded first.
  useEffect(() => {
    applyRouteSeo(location);
  }, [location]);

  /**
   * Prefetch a route as soon as the visitor signals intent (hover or keyboard
   * focus), so the chunk is usually in memory by the time the click lands and
   * the destination renders with no loading state at all.
   *
   * Delegated from the document rather than added to each <Link>: internal
   * links are rendered by the navbar, footer, breadcrumbs and page bodies, and
   * wiring every one of them by hand is how a prefetch quietly stops covering
   * the link people actually use. loadPage() de-duplicates concurrent requests,
   * so repeated hovers cost nothing.
   */
  useEffect(() => {
    const prefetchFromEvent = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      // Same-origin path only: strip the query/hash and skip real files.
      const path = href.split("#")[0].split("?")[0];
      if (/\.[a-z0-9]{2,5}$/i.test(path)) return;
      const name = pageForPath(path);
      if (getLoadedPage(name)) return;
      // Failures are ignored here: this is speculative, and the real
      // navigation path reports problems to the visitor.
      loadPage(name).catch(() => {});
    };

    document.addEventListener("mouseover", prefetchFromEvent, { passive: true });
    document.addEventListener("focusin", prefetchFromEvent, { passive: true });
    return () => {
      document.removeEventListener("mouseover", prefetchFromEvent);
      document.removeEventListener("focusin", prefetchFromEvent);
    };
  }, []);

  return (
    <Switch>
      <Route path="/" component={() => <Layout><Page name="Home" /></Layout>} />
      <Route path="/about" component={() => <Layout><Page name="About" /></Layout>} />
      <Route path="/products" component={() => <Layout><Page name="Products" /></Layout>} />
      <Route path="/products/solar" component={() => <Layout><Page name="CategoryProducts" /></Layout>} />
      <Route path="/products/home-appliances" component={() => <Layout><Page name="CategoryProducts" /></Layout>} />
      <Route path="/products/3c-electronics" component={() => <Layout><Page name="CategoryProducts" /></Layout>} />
      <Route path="/products/:id" component={() => <Layout><Page name="ProductDetail" /></Layout>} />
      <Route path="/guides" component={() => <Layout><Page name="Guides" /></Layout>} />
      <Route path="/guides/:slug" component={() => <Layout><Page name="Guide" /></Layout>} />
      <Route path="/factory" component={() => <Layout><Page name="Factory" /></Layout>} />
      <Route path="/team" component={() => <Layout><Page name="Team" /></Layout>} />
      <Route path="/services" component={() => <Layout><Page name="Services" /></Layout>} />
      <Route path="/faq" component={() => <Layout><Page name="FAQ" /></Layout>} />
      <Route path="/news" component={() => <Layout><Page name="News" /></Layout>} />
      <Route path="/careers" component={() => <Layout><Page name="Careers" /></Layout>} />
      <Route path="/contact" component={() => <Layout><Page name="Contact" /></Layout>} />
      <Route path="/privacy" component={() => <Layout><Page name="Privacy" /></Layout>} />
      <Route path="/terms" component={() => <Layout><Page name="Terms" /></Layout>} />
      <Route path="/admin" component={() => <AdminLayout><Page name="Admin" /></AdminLayout>} />
      <Route path="/404" component={() => <Layout><Page name="NotFound" /></Layout>} />
      <Route component={() => <Layout><Page name="NotFound" /></Layout>} />
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
