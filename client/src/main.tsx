import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { installChunkErrorReload, loadPage, pageForPath } from "./lib/pages";

/**
 * Boot strategy.
 *
 * Every route is prerendered to static HTML (see prerender.mjs), so the browser
 * paints real content within a few hundred milliseconds. Two separate things
 * then fought over that markup and produced the reported symptoms:
 *
 *  1. createRoot() discards the prerendered DOM and remounts the whole tree, so
 *     the page went blank behind a spinner until the lazy route chunk arrived.
 *     On a slow mobile connection that window is seconds long.
 *
 *  2. React.lazy() suspends on its *first* render even when the chunk is already
 *     in memory, so preloading alone was not enough: the one guaranteed
 *     suspended pass still swapped the prerendered page for the spinner.
 *
 * So we load the current route's module first and only mount once it is in
 * memory (lib/pages.ts caches it, letting the first render run synchronously).
 *
 * If the prerendered page is intact it is a better fallback than a spinner: it
 * is fully readable and its links are real <a href> elements, so a stalled chunk
 * degrades to a static page instead of a blank one or an endless spinner. An
 * empty shell (e.g. /admin) has no such fallback, so it mounts early and lets
 * the route render its own retry UI.
 */

const container = document.getElementById("root")!;

/**
 * Prerendered pages already show the right content, so replacing them is only
 * worth it once the app can render that same content. A route with an empty
 * shell has nothing to protect, so it may mount early.
 */
const hasPrerenderedContent = container.children.length > 0;

/** Fallback for an empty shell: show the layout rather than a blank screen. */
const MOUNT_TIMEOUT_MS = 8000;

let mounted = false;
function mount() {
  if (mounted) return;
  mounted = true;
  createRoot(container).render(<App />);
}

/** Mount only when there is nothing readable on screen to lose. */
function mountFallback() {
  if (!hasPrerenderedContent) mount();
}

// Registered before any import can fail, so the very first route is covered.
installChunkErrorReload();

const routePromise = loadPage(pageForPath(window.location.pathname));

// Normal path: the chunk is here, so the app can render over the prerendered
// markup without ever showing a spinner.
routePromise.then(mount, mountFallback);

// A request that never settles is not an error, so nothing above would ever
// fire. Without this, an empty shell stayed blank forever.
setTimeout(mountFallback, MOUNT_TIMEOUT_MS);
