export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // GitHub Pages 源地址
    const githubPagesUrl = 'https://ws006.github.io/houseplus-website';
    
    // 静态文件扩展名列表
    const staticExtensions = [
      '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
      '.woff', '.woff2', '.ttf', '.eot', '.ico', '.txt', '.xml', '.json',
      '.map', '.webmanifest'
    ];
    
    // 检查是否是静态文件
    const isStaticFile = staticExtensions.some(ext => pathname.endsWith(ext));
    
    // 构建完整的 GitHub Pages URL
    let targetUrl = `${githubPagesUrl}${pathname}`;
    
    // 如果是静态文件或根路径，直接获取
    if (isStaticFile || pathname === '/') {
      try {
        const response = await fetch(targetUrl, {
          method: request.method,
          headers: request.headers,
        });
        return response;
      } catch (error) {
        return new Response('Service Unavailable', { status: 503 });
      }
    }
    
    // 尝试获取请求的文件
    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
      });
      
      // 如果文件存在（200），返回它
      if (response.status === 200) {
        return response;
      }
      
      // 如果文件不存在（404），尝试返回 index.html
      if (response.status === 404) {
        const indexUrl = `${githubPagesUrl}/index.html`;
        const indexResponse = await fetch(indexUrl, {
          method: 'GET',
          headers: {
            'Accept': 'text/html',
          },
        });
        
        if (indexResponse.status === 200) {
          return new Response(indexResponse.body, {
            status: 200,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'public, max-age=3600',
            },
          });
        }
      }
      
      // 其他错误响应直接返回
      return response;
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Service Unavailable', { status: 503 });
    }
  },
};
