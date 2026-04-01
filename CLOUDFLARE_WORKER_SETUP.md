# Cloudflare Worker 部署指南 - SPA 路由解决方案

## 问题描述

GitHub Pages 在自定义域名上不支持 SPA 路由。当用户直接访问 `/privacy` 或 `/terms` 等子页面时，GitHub Pages 返回 404 错误，因为它无法将请求自动重定向到 `index.html`。

## 解决方案

使用 Cloudflare Worker 在 CDN 层拦截所有请求，如果文件不存在，则自动重定向到 `index.html`，让前端 React Router 接管路由。

## 部署步骤

### 1. 登录 Cloudflare Dashboard

访问 [https://dash.cloudflare.com](https://dash.cloudflare.com) 并登录你的 Cloudflare 账户。

### 2. 进入 Workers 部分

1. 在左侧菜单中找到 **Workers & Pages**
2. 点击 **Create application**
3. 选择 **Create a Worker**

### 3. 创建新 Worker

1. 给 Worker 起个名字，例如 `houseplus-spa-router`
2. 点击 **Deploy**

### 4. 编辑 Worker 代码

1. 点击 **Edit code**
2. 将以下代码复制到编辑器中：

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 静态文件扩展名列表
    const staticExtensions = [
      '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
      '.woff', '.woff2', '.ttf', '.eot', '.ico', '.txt', '.xml', '.json'
    ];

    // 检查是否是静态文件
    const isStaticFile = staticExtensions.some(ext => pathname.endsWith(ext));

    // 如果是静态文件或根路径，直接获取
    if (isStaticFile || pathname === '/') {
      return fetch(request);
    }

    // 尝试获取请求的文件
    const response = await fetch(request);

    // 如果文件存在（200），返回它
    if (response.status === 200) {
      return response;
    }

    // 如果文件不存在（404），返回 index.html
    if (response.status === 404) {
      const indexResponse = await fetch(new Request(new URL('/', url).toString(), {
        method: 'GET',
        headers: request.headers,
      }));
      
      return new Response(indexResponse.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // 其他错误响应直接返回
    return response;
  },
};
```

3. 点击 **Save and Deploy**

### 5. 配置 Worker 路由

1. 返回 Workers & Pages 页面
2. 找到你创建的 Worker（`houseplus-spa-router`）
3. 点击 **Settings**
4. 在 **Triggers** 部分，点击 **Add route**
5. 添加以下路由：
   - **Route**: `www.houseplus.com.ng/*`
   - **Zone**: 选择 `houseplus.com.ng`
   - 点击 **Save**

### 6. 验证部署

1. 等待 1-2 分钟让配置生效
2. 访问以下 URL 进行测试：
   - https://www.houseplus.com.ng/privacy - 应该显示 Privacy Policy 页面
   - https://www.houseplus.com.ng/terms - 应该显示 Terms of Service 页面
   - https://www.houseplus.com.ng/about - 应该显示 About 页面

## 工作原理

1. **请求拦截**: Cloudflare Worker 拦截所有发往 `www.houseplus.com.ng` 的请求
2. **静态文件直通**: 对于 CSS、JS、图片等静态资源，直接从 GitHub Pages 获取
3. **路由重定向**: 对于不存在的文件（如 `/privacy`），Worker 返回 `index.html`
4. **前端路由**: React Router 在浏览器中接收 `index.html`，根据 URL 路径渲染相应的页面

## 缓存策略

- **静态资源**: 由 Cloudflare 缓存（通常 24 小时）
- **HTML 文件**: 缓存 1 小时（`max-age=3600`），确保更新及时生效
- **API 请求**: 不缓存

## 成本

Cloudflare Workers 免费计划包括：
- 每天 100,000 个请求
- 足以支持中小型网站

如需更高的请求限制，可升级到付费计划。

## 故障排除

### 问题：页面仍然返回 404

**解决方案**：
1. 检查 Worker 是否已启用（在 Workers & Pages 中查看状态）
2. 检查路由是否正确配置（应该是 `www.houseplus.com.ng/*`）
3. 清除浏览器缓存并重新加载
4. 等待 5 分钟让 Cloudflare 配置完全生效

### 问题：静态资源加载失败

**解决方案**：
1. 检查 GitHub Pages 中的文件是否存在
2. 确保 `dist/public/assets/` 目录中的文件已正确上传
3. 检查 Cloudflare Worker 日志以查看具体错误

## 监控和日志

1. 在 Worker 详情页面，点击 **Logs**
2. 查看最近的请求和响应
3. 如有错误，会显示在日志中

## 后续优化

1. **性能优化**: 考虑在 Worker 中添加缓存头，减少重复请求
2. **安全增强**: 添加 CORS 头和安全相关的 HTTP 头
3. **分析**: 集成 Cloudflare Analytics 来跟踪流量和性能

---

**部署完成后，所有 SPA 路由都应该能正常工作！**
