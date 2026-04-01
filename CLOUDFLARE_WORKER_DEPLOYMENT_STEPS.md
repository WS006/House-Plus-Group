# Cloudflare Worker 部署详细步骤指南

## 第一步：登录 Cloudflare Dashboard

1. 打开浏览器，访问 [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. 输入你的 Cloudflare 账户邮箱和密码
3. 点击 **Sign In** 登录
4. 如果启用了两步验证，按照提示完成验证

## 第二步：进入 Workers & Pages 部分

1. 登录成功后，你会看到 Cloudflare Dashboard 主页
2. 在左侧菜单栏中，找到 **Workers & Pages** 选项（如果看不到，可能需要向下滚动）
3. 点击 **Workers & Pages**

## 第三步：创建新 Worker

1. 在 Workers & Pages 页面中，点击 **Create application** 按钮
2. 在弹出的选项中，选择 **Create a Worker**
3. 系统会自动生成一个 Worker 名称（例如 `worker-abc123`）
4. 你可以修改这个名称为 `houseplus-spa-router`（更容易识别）
5. 点击 **Deploy** 按钮

## 第四步：编辑 Worker 代码

1. Worker 创建完成后，你会看到一个代码编辑器
2. 编辑器中会有一些默认代码，**全部删除**
3. 复制以下代码并粘贴到编辑器中：

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

4. 代码粘贴完成后，点击右下角的 **Save and Deploy** 按钮

## 第五步：配置 Worker 路由

1. Worker 部署完成后，你会看到一个确认消息
2. 点击 **Back to Workers** 或返回 Workers & Pages 页面
3. 你会看到刚才创建的 Worker（`houseplus-spa-router`）
4. 点击这个 Worker 的名称进入详情页面
5. 在页面中找到 **Triggers** 部分
6. 点击 **Add route** 按钮

## 第六步：添加路由规则

1. 在弹出的对话框中，你会看到两个输入框：
   - **Route**: 输入 `www.houseplus.com.ng/*`
   - **Zone**: 从下拉菜单中选择 `houseplus.com.ng`

2. 输入完成后，点击 **Save** 按钮

**重要**：确保路由格式正确：
- `www.houseplus.com.ng/*` 表示所有发往这个域名的请求都会通过 Worker 处理
- 如果你的域名不同，请替换为你的实际域名

## 第七步：等待配置生效

1. 配置保存后，Cloudflare 需要 1-2 分钟来应用这些设置
2. 在这段时间内，你可以看到一个"正在部署"的状态指示
3. 等待状态变为"已部署"或"Active"

## 第八步：测试 SPA 路由

现在是验证一切是否正常工作的时候了。打开浏览器，测试以下 URL：

### 测试 1：Privacy Policy 页面
1. 访问 `https://www.houseplus.com.ng/privacy`
2. 页面应该显示 Privacy Policy 的完整内容（不是 404 错误页面）
3. 打开浏览器开发者工具（按 F12）
4. 进入 **Network** 标签
5. 刷新页面
6. 查看 `privacy` 请求的状态码，应该是 **200**（不是 404）

### 测试 2：Terms of Service 页面
1. 访问 `https://www.houseplus.com.ng/terms`
2. 页面应该显示 Terms of Service 的完整内容
3. 用同样的方法检查状态码，应该是 **200**

### 测试 3：About 页面
1. 访问 `https://www.houseplus.com.ng/about`
2. 页面应该显示 About 页面内容
3. 检查状态码为 **200**

### 测试 4：其他页面
测试其他所有页面，确保都能正常加载：
- `https://www.houseplus.com.ng/products`
- `https://www.houseplus.com.ng/factory`
- `https://www.houseplus.com.ng/team`
- `https://www.houseplus.com.ng/services`
- `https://www.houseplus.com.ng/faq`
- `https://www.houseplus.com.ng/news`
- `https://www.houseplus.com.ng/careers`
- `https://www.houseplus.com.ng/contact`

## 故障排除

### 问题 1：页面仍然返回 404

**原因**：Worker 可能还没有完全生效

**解决方案**：
1. 等待 5 分钟后再试
2. 清除浏览器缓存（Ctrl+Shift+Delete 或 Cmd+Shift+Delete）
3. 使用无痕/隐私浏览模式重新访问页面

### 问题 2：Worker 显示错误

**原因**：代码可能有语法错误

**解决方案**：
1. 返回 Worker 编辑器
2. 检查代码是否完整（没有缺少的括号或分号）
3. 重新复制粘贴代码
4. 点击 **Save and Deploy**

### 问题 3：静态资源（CSS、JS、图片）无法加载

**原因**：可能是缓存问题或路由配置错误

**解决方案**：
1. 检查浏览器开发者工具的 Network 标签
2. 查看失败的资源的 URL
3. 确保这些资源在 GitHub Pages 上存在
4. 清除 Cloudflare 缓存：
   - 进入 Cloudflare Dashboard
   - 选择你的域名
   - 进入 **Caching** > **Cache Purge**
   - 点击 **Purge Everything**

## 验证成功的标志

✅ 所有页面都能加载
✅ 页面返回 HTTP 状态码 200
✅ 页面内容完整显示
✅ 导航链接正常工作
✅ 静态资源（CSS、JS、图片）正常加载

## 下一步

部署完成后，建议：

1. **在 Google Search Console 中重新提交页面** — 告诉 Google 这些页面现在可以正确访问
2. **监控 Cloudflare Worker 日志** — 定期检查是否有错误
3. **设置性能告警** — 如果页面加载时间过长，Cloudflare 会发送通知

---

**如果在部署过程中遇到任何问题，请截图错误信息并告诉我！**
