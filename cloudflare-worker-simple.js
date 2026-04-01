// Security headers configuration
const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://d2xsxph8kpxj0f.cloudfront.net https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self' https:; frame-ancestors 'none'",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // GitHub Pages 源地址
    const githubPagesUrl = 'https://ws006.github.io/House-Plus-Group';
    
    // 静态文件扩展名列表（这些文件直接从 GitHub Pages 获取）
    const staticExtensions = [
      '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
      '.woff', '.woff2', '.ttf', '.eot', '.ico', '.txt', '.xml', '.json',
      '.map', '.webmanifest', '.mp4', '.webm'
    ];
    
    // 检查是否是静态文件
    const isStaticFile = staticExtensions.some(ext => pathname.endsWith(ext));
    
    // 如果是静态文件，直接从 GitHub Pages 获取
    if (isStaticFile) {
      const targetUrl = `${githubPagesUrl}${pathname}`;
      try {
        const response = await fetch(targetUrl);
        return response;
      } catch (error) {
        console.error('Static file fetch error:', error);
        return new Response('Not Found', { status: 404 });
      }
    }
    
    // 对于所有其他请求（包括 HTML 路由），返回 index.html
    // 让 React Router 在浏览器中处理路由
    try {
      const indexUrl = `${githubPagesUrl}/index.html`;
      const response = await fetch(indexUrl);
      
      if (response.status === 200) {
        const headers = new Headers(response.headers);
        // Add security headers
        Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
          headers.set(key, value);
        });
        // Set cache control
        headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
        headers.set('Content-Type', 'text/html; charset=utf-8');
        
        return new Response(response.body, {
          status: 200,
          headers,
        });
      }
      
      return new Response('Service Unavailable', { status: 503 });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Service Unavailable', { status: 503 });
    }
  },
};
