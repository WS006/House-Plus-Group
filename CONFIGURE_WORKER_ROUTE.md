# 配置 Cloudflare Worker 路由规则 - 详细步骤

## 你的 Worker 信息

- **Worker 名称**: houseplus-spa-router
- **Worker URL**: houseplus-spa-router.jack006hu.workers.dev
- **目标域名**: www.houseplus.com.ng

## 第一步：进入 Cloudflare Dashboard

1. 打开浏览器，访问 [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. 登录你的 Cloudflare 账户
3. 在左侧菜单中找到 **Workers & Pages**
4. 点击进入

## 第二步：找到你的 Worker

1. 在 Workers & Pages 页面中，你会看到你创建的 Worker：**houseplus-spa-router**
2. 点击这个 Worker 的名称进入详情页面

## 第三步：进入 Triggers 部分

1. 在 Worker 详情页面中，找到 **Triggers** 部分
2. 你会看到一个 **Add route** 按钮
3. 点击 **Add route**

## 第四步：配置路由规则

点击 **Add route** 后，会弹出一个对话框。你会看到两个主要的输入框：

### 输入框 1：Route（路由）

**输入内容**：`www.houseplus.com.ng/*`

**说明**：
- `www.houseplus.com.ng` - 你的域名
- `/*` - 表示这个域名下的所有路径都会通过 Worker 处理
- 例如：`/privacy`、`/terms`、`/about` 等都会被处理

### 输入框 2：Zone（区域）

这是一个下拉菜单。

**选择**：`houseplus.com.ng`

**说明**：
- 这是你的 Cloudflare 区域（域名）
- 从下拉菜单中选择你的域名

## 第五步：保存路由

1. 确认两个输入框都填写正确：
   - Route: `www.houseplus.com.ng/*`
   - Zone: `houseplus.com.ng`
2. 点击 **Save** 按钮

## 第六步：等待配置生效

1. 配置保存后，Cloudflare 需要几秒到几分钟来应用这些设置
2. 你会看到一个确认消息
3. 路由规则现在应该已经生效

## 第七步：测试 Worker 路由

现在测试 Worker 是否正确处理了你的域名请求。

### 测试 1：访问 Privacy Policy 页面

1. 打开浏览器，访问：
   ```
   https://www.houseplus.com.ng/privacy
   ```

2. 页面应该显示 Privacy Policy 的完整内容

3. 打开浏览器开发者工具（按 F12）

4. 进入 **Network** 标签

5. 刷新页面（Ctrl+R 或 Cmd+R）

6. 查看请求列表，找到 `privacy` 或主文档请求

7. 检查状态码：
   - ✅ 应该是 **200**（表示成功）
   - ❌ 不应该是 404（表示失败）

### 测试 2：访问 Terms of Service 页面

1. 访问：
   ```
   https://www.houseplus.com.ng/terms
   ```

2. 页面应该显示 Terms of Service 的完整内容

3. 用同样的方法检查状态码，应该是 **200**

### 测试 3：访问其他页面

测试其他所有页面，确保都能正常加载：

- `https://www.houseplus.com.ng/about` - About 页面
- `https://www.houseplus.com.ng/products` - Products 页面
- `https://www.houseplus.com.ng/factory` - Factory 页面
- `https://www.houseplus.com.ng/team` - Team 页面
- `https://www.houseplus.com.ng/services` - Services 页面
- `https://www.houseplus.com.ng/faq` - FAQ 页面
- `https://www.houseplus.com.ng/news` - News 页面
- `https://www.houseplus.com.ng/careers` - Careers 页面
- `https://www.houseplus.com.ng/contact` - Contact 页面

## 常见问题

### Q1：页面仍然返回 404

**可能原因**：
1. Worker 路由规则还没有完全生效
2. DNS 缓存问题
3. Worker 代码有问题

**解决方案**：
1. 等待 5-10 分钟让配置完全生效
2. 清除浏览器缓存（Ctrl+Shift+Delete）
3. 使用无痕/隐私浏览模式重新访问
4. 检查 Worker 代码是否正确

### Q2：看不到 "Add route" 按钮

**解决方案**：
1. 确保你在 Worker 详情页面（不是列表页面）
2. 向下滚动找 **Triggers** 部分
3. 如果还是看不到，点击 **Settings** 标签，然后找 **Triggers**

### Q3：选择 Zone 时看不到我的域名

**解决方案**：
1. 确保你的域名已经在 Cloudflare 上
2. 确保你已经登录正确的 Cloudflare 账户
3. 如果还是看不到，可能需要先在 Cloudflare 上添加你的域名

### Q4：Worker 返回错误

**查看错误日志**：
1. 进入 Worker 详情页面
2. 点击 **Logs** 标签
3. 查看最近的请求和错误信息

**常见错误**：
- `TypeError: fetch is not defined` - Worker 代码有问题
- `CORS error` - 跨域问题
- `Timeout` - 请求超时

### Q5：静态资源（CSS、JS、图片）无法加载

**原因**：Worker 可能阻止了静态资源

**解决方案**：
1. 检查 Worker 代码中的 `staticExtensions` 列表
2. 确保包含了所有需要的文件类型
3. 清除 Cloudflare 缓存：
   - 进入你的域名设置
   - 进入 **Caching** > **Cache Purge**
   - 点击 **Purge Everything**

## 验证成功的标志

✅ 所有页面都能加载
✅ 页面返回 HTTP 状态码 200
✅ 页面内容完整显示
✅ 导航链接正常工作
✅ 静态资源（CSS、JS、图片）正常加载
✅ 浏览器地址栏显示 HTTPS 和绿色锁图标

## 下一步

配置完成并测试成功后：

1. **在 Google Search Console 中重新提交页面** — 告诉 Google 这些页面现在可以正确访问
2. **监控 Worker 日志** — 定期检查是否有错误
3. **设置告警** — 如果 Worker 出现问题，Cloudflare 会发送通知

---

**配置完成后，你的网站将获得完整的 SPA 路由支持！**

如果在配置过程中遇到任何问题，请告诉我具体的错误信息或症状。
