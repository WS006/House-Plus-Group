export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // GitHub Pages 源地址
    const githubPagesUrl = 'https://ws006.github.io/houseplus-website';
    
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
        return new Response(response.body, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
            'X-Content-Type-Options': 'nosniff',
          },
        });
      }
      
      return new Response('Service Unavailable', { status: 503 });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Service Unavailable', { status: 503 });
    }
  },
};
