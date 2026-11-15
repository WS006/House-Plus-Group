import type { ComponentType } from "react";

/**
 * Single source of truth for the page modules.
 *
 * Routes are code-split, but React.lazy() *always* suspends on its first render
 * — even when the chunk is already in memory — because its initializer returns a
 * promise that can only settle in a microtask. That guaranteed one suspended
 * pass, which replaced the prerendered page with a full-screen spinner and
 * produced the "blank page / spinner while waiting" reports.
 *
 * A module cache fixes that: main.tsx preloads the current route before mounting,
 * so by the time the first render runs the component is already available and is
 * rendered synchronously. Only a route whose chunk is genuinely not loaded yet
 * (a client-side navigation to a page that was never prefetched) shows a loader.
 *
 * The loaders live in one place so App.tsx and main.tsx cannot drift apart: two
 * copies of this mapping previously risked preloading a chunk nobody renders.
 */
export type PageModule = { default: ComponentType<any> };

const LOADERS = {
  Home: () => import("../pages/Home"),
  About: () => import("../pages/About"),
  Products: () => import("../pages/Products"),
  ProductDetail: () => import("../pages/ProductDetail"),
  CategoryProducts: () => import("../pages/CategoryProducts"),
  Guides: () => import("../pages/Guides"),
  Guide: () => import("../pages/Guide"),
  Factory: () => import("../pages/Factory"),
  Team: () => import("../pages/Team"),
  Services: () => import("../pages/Services"),
  FAQ: () => import("../pages/FAQ"),
  News: () => import("../pages/News"),
  Careers: () => import("../pages/Careers"),
  Contact: () => import("../pages/Contact"),
  Admin: () => import("../pages/Admin"),
  Privacy: () => import("../pages/Privacy"),
  Terms: () => import("../pages/Terms"),
  NotFound: () => import("../pages/NotFound"),
} satisfies Record<string, () => Promise<PageModule>>;

export type PageName = keyof typeof LOADERS;

export const PAGE_NAMES = Object.keys(LOADERS) as PageName[];

/** Modules already in memory, keyed by page name. */
const loaded = new Map<PageName, PageModule>();

/** In-flight imports, so concurrent renders share one request. */
const inflight = new Map<PageName, Promise<PageModule>>();

/** Loads a page module, reusing the in-memory copy when possible. */
export function loadPage(name: PageName): Promise<PageModule> {
  const ready = loaded.get(name);
  if (ready) return Promise.resolve(ready);

  let promise = inflight.get(name);
  if (!promise) {
    promise = LOADERS[name]().then((mod) => {
      // Vite dispatches vite:preloadError and, when a listener calls
      // preventDefault(), resolves the import with undefined instead of
      // rejecting. Caching that would leave the route permanently empty, so a
      // module without a component is treated as a failed load.
      if (!mod || typeof mod.default !== "function") {
        throw new Error("Importing a module script failed (empty module).");
      }
      loaded.set(name, mod);
      inflight.delete(name);
      return mod;
    });
    // A failed load must not poison the cache forever: clear it so a retry
    // can issue a fresh request.
    promise.catch(() => inflight.delete(name));
    inflight.set(name, promise);
  }
  return promise;
}

/** Synchronous lookup used during render; undefined until the chunk arrives. */
export function getLoadedPage(name: PageName): PageModule | undefined {
  return loaded.get(name);
}

/** Drops the cached failure so the next render issues a fresh request. */
export function resetPageLoad(name: PageName): void {
  inflight.delete(name);
}

/**
 * True when an import failed because the chunk could not be fetched.
 *
 * Browsers word this differently: Chrome says "Failed to fetch dynamically
 * imported module", Safari "Importing a module script failed", Firefox "error
 * loading dynamically imported module". A network drop, an offline phone and a
 * chunk deleted by a newer deploy all land here.
 */
export function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /dynamically imported module|module script failed|error loading dynamically imported module|Importing a module/i.test(
    message
  );
}

const RELOAD_KEY = "houseplus_chunk_reload_at";
const RELOAD_WINDOW_MS = 30000;

/**
 * Reloads once to pick up a fresh build after a chunk disappeared.
 *
 * Every deploy publishes new content-hashed filenames and removes the old ones
 * (tools/publish-docs.mjs mirrors the directory). A visitor holding cached HTML
 * — or a tab left open across a release — then requests a chunk that no longer
 * exists, and every client-side navigation into that route fails. Reloading
 * fetches the new HTML and its matching chunks, which fixes it.
 *
 * Returns true when a reload was started. The time window keeps a genuinely
 * broken deployment from becoming a reload loop: the second failure inside 30s
 * falls through to the visible retry UI instead.
 */
export function reloadForStaleChunk(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < RELOAD_WINDOW_MS) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    // Storage blocked (private mode, third-party cookie policy). Without a
    // guard a reload could loop forever, so prefer the retry UI.
    return false;
  }
  window.location.reload();
  return true;
}

/**
 * Installs the one place that reacts to a failed chunk request.
 *
 * Vite fires `vite:preloadError` on window before it rethrows, for every failed
 * dynamic import. Handling it centrally means a navigation, a prefetch and the
 * initial boot all recover the same way, instead of each call site inventing
 * its own fallback. `preventDefault()` suppresses the unhandled rejection that
 * used to reach the top-level ErrorBoundary and replace the entire site with
 * "An unexpected error occurred".
 */
export function installChunkErrorReload(): void {
  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    reloadForStaleChunk();
  });
}

/** Resolves the page name for a pathname. */
export function pageForPath(pathname: string): PageName {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (p === "/") return "Home";
  if (p === "/about") return "About";
  if (p === "/products") return "Products";
  if (p === "/products/solar" || p === "/products/home-appliances" || p === "/products/3c-electronics")
    return "CategoryProducts";
  if (p.startsWith("/products/")) return "ProductDetail";
  if (p === "/guides") return "Guides";
  if (p.startsWith("/guides/")) return "Guide";
  if (p === "/factory") return "Factory";
  if (p === "/team") return "Team";
  if (p === "/services") return "Services";
  if (p === "/faq") return "FAQ";
  if (p === "/news") return "News";
  if (p === "/careers") return "Careers";
  if (p === "/contact") return "Contact";
  if (p === "/admin") return "Admin";
  if (p === "/privacy") return "Privacy";
  if (p === "/terms") return "Terms";
  return "NotFound";
}
