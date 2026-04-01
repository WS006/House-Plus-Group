/**
 * Cloudflare Worker for SPA Routing
 * 
 * This worker handles SPA routing for GitHub Pages by:
 * 1. Checking if the requested file exists
 * 2. If not, serving index.html instead
 * 3. Allowing static assets (CSS, JS, images) to be served normally
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // List of static file extensions that should be served as-is
    const staticExtensions = [
      '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
      '.woff', '.woff2', '.ttf', '.eot', '.ico', '.txt', '.xml', '.json'
    ];

    // Check if the request is for a static file
    const isStaticFile = staticExtensions.some(ext => pathname.endsWith(ext));

    // If it's a static file or the root path, fetch normally
    if (isStaticFile || pathname === '/') {
      return fetch(request);
    }

    // For all other requests (routes), try to fetch the file
    const response = await fetch(request);

    // If the file exists (status 200), return it
    if (response.status === 200) {
      return response;
    }

    // If the file doesn't exist (404), serve index.html instead
    // This allows React Router to handle the routing
    if (response.status === 404) {
      const indexResponse = await fetch(new Request(new URL('/', url).toString(), {
        method: 'GET',
        headers: request.headers,
      }));
      
      // Return index.html with 200 status so the browser doesn't cache the 404
      return new Response(indexResponse.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // For other error responses, return them as-is
    return response;
  },
};
