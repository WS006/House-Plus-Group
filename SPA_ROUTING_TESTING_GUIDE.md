# House Plus Group - SPA 路由测试和 Google 重新索引指南

## 📋 概述

本指南说明如何测试 spa-github-pages 方案是否正确实施，以及如何通知 Google 重新索引网站。

---

## ✅ 步骤 1：验证 GitHub Pages 部署

### 检查 GitHub Pages 配置

1. 访问 GitHub 仓库：https://github.com/WS006/houseplus-website
2. 点击 **Settings** → **Pages**
3. 验证以下配置：
   - **Source：** Deploy from a branch
   - **Branch：** main / docs
   - **Custom domain：** www.houseplus.com.ng
   - **Enforce HTTPS：** ✅ 已启用

### 验证 CNAME 文件

1. 访问 https://www.houseplus.com.ng/CNAME
2. 应该看到：`www.houseplus.com.ng`

---

## 🧪 步骤 2：测试 SPA 路由

### 测试 1：直接访问子页面

**测试 URL：** https://www.houseplus.com.ng/factory

**预期结果：**
- ✅ 页面正常加载（不显示 404）
- ✅ 地址栏保持 `/factory`（不会变成 `/?p=factory`）
- ✅ 页面内容正确显示

**如果失败：**
- 打开浏览器开发者工具 → Network 标签
- 刷新页面
- 查看 factory 文档请求的状态码
- 应该是 **200**（而不是 404）

### 测试 2：测试所有 10 个页面

在浏览器中依次访问以下 URL，确保都能正常加载：

| 页面 | URL | 预期状态 |
|------|-----|--------|
| Home | https://www.houseplus.com.ng/ | 200 ✅ |
| About | https://www.houseplus.com.ng/about | 200 ✅ |
| Products | https://www.houseplus.com.ng/products | 200 ✅ |
| Factory | https://www.houseplus.com.ng/factory | 200 ✅ |
| Team | https://www.houseplus.com.ng/team | 200 ✅ |
| Services | https://www.houseplus.com.ng/services | 200 ✅ |
| FAQ | https://www.houseplus.com.ng/faq | 200 ✅ |
| News | https://www.houseplus.com.ng/news | 200 ✅ |
| Careers | https://www.houseplus.com.ng/careers | 200 ✅ |
| Contact | https://www.houseplus.com.ng/contact | 200 ✅ |

### 测试 3：测试 404 页面

**测试 URL：** https://www.houseplus.com.ng/nonexistent

**预期结果：**
- ✅ 显示 404 Not Found 页面
- ✅ 地址栏保持 `/nonexistent`

### 测试 4：测试页面间导航

1. 访问 Home 页面
2. 点击导航菜单中的 "Products"
3. 预期结果：
   - ✅ 页面平滑加载
   - ✅ 地址栏变为 `/products`
   - ✅ 无刷新，无闪烁

### 测试 5：测试浏览器后退/前进

1. 访问 Home 页面
2. 点击 "About" 链接
3. 点击浏览器 "后退" 按钮
4. 预期结果：
   - ✅ 返回 Home 页面
   - ✅ 地址栏变为 `/`
   - ✅ 页面内容正确

---

## 📊 步骤 3：验证 HTTP 状态码

### 使用 curl 检查状态码

```bash
# 测试 Home 页面
curl -I https://www.houseplus.com.ng/

# 测试 Factory 页面
curl -I https://www.houseplus.com.ng/factory

# 测试 404 页面
curl -I https://www.houseplus.com.ng/nonexistent
```

**预期结果：**
- Home 和 Factory：`HTTP/1.1 200 OK`
- 404 页面：`HTTP/1.1 404 Not Found`

### 使用在线工具检查

1. 访问 https://www.whatsmydns.net/
2. 输入 URL：https://www.houseplus.com.ng/factory
3. 查看 HTTP 状态码应该是 **200**

---

## 🔍 步骤 4：验证 404.html 和 SPA 脚本

### 检查 404.html 是否存在

访问 https://www.houseplus.com.ng/404.html

**预期结果：**
- ✅ 页面加载（可能是空白，但不会显示 404 错误）
- ✅ 状态码是 **200**

### 验证 SPA 脚本

1. 打开浏览器开发者工具 → Console 标签
2. 访问 https://www.houseplus.com.ng/factory
3. 查看控制台是否有错误
4. 预期结果：
   - ✅ 无错误
   - ✅ 页面正常加载

---

## 🔄 步骤 5：通知 Google 重新抓取

### 方法 1：使用 Google Search Console（推荐）

#### 5.1 验证网站所有权

如果还未验证，先验证网站所有权：

1. 访问 https://search.google.com/search-console
2. 点击 **"添加资源"**
3. 选择 **"网址前缀"**
4. 输入：`https://www.houseplus.com.ng`
5. 选择验证方法（DNS 或 HTML 文件）
6. 完成验证

#### 5.2 提交 Sitemap

1. 在 GSC 中打开已验证的资源
2. 左侧菜单 → **"Sitemaps"**
3. 点击 **"新增 Sitemap"**
4. 输入：`https://www.houseplus.com.ng/sitemap.xml`
5. 点击 **"提交"**

#### 5.3 手动提交页面

对于每个页面，使用 **"URL 检查"** 工具：

1. 打开 GSC 资源
2. 点击顶部 **"URL 检查"** 输入框
3. 输入页面 URL（例如：`https://www.houseplus.com.ng/factory`）
4. 点击 **"请求编入索引"**
5. 重复此过程，提交所有 10 个页面

### 方法 2：使用 Google Ping

```bash
# Ping Google 通知新的 Sitemap
curl "https://www.google.com/ping?sitemap=https://www.houseplus.com.ng/sitemap.xml"

# Ping Bing 通知新的 Sitemap
curl "https://www.bing.com/ping?sitemap=https://www.houseplus.com.ng/sitemap.xml"
```

### 方法 3：使用 robots.txt

验证 robots.txt 中的 Sitemap 指向正确：

访问 https://www.houseplus.com.ng/robots.txt

应该看到：
```
Sitemap: https://www.houseplus.com.ng/sitemap.xml
```

---

## ⏱️ 预期时间表

| 操作 | 时间 |
|------|------|
| GitHub Pages 部署 | 1-5 分钟 |
| DNS 生效 | 5-30 分钟 |
| Google 首次爬取 | 1-24 小时 |
| 页面重新索引 | 2-7 天 |
| 搜索结果更新 | 1-4 周 |

---

## 📈 监控索引进度

### 检查 Google Search Console

1. 打开 GSC 资源
2. 左侧菜单 → **"覆盖率"**
3. 查看以下指标：
   - **有效** ✅：已成功索引的页面
   - **警告** ⚠️：已索引但有问题
   - **错误** ❌：未能索引的页面
   - **已排除** ⊘：被 robots.txt 或 noindex 排除

### 预期结果

- **有效：** 10 个页面（所有公开页面）
- **警告：** 0
- **错误：** 0
- **已排除：** 0

---

## 🔧 故障排除

### 问题 1：页面仍显示 404

**症状：** 访问 `/factory` 时显示 404 错误

**排查步骤：**

1. 检查 GitHub Pages 是否已部署
   - 访问 GitHub 仓库 → Settings → Pages
   - 确认部署状态为 "✓ Your site is live"

2. 检查 CNAME 文件
   - 访问 https://www.houseplus.com.ng/CNAME
   - 应该显示：`www.houseplus.com.ng`

3. 检查 404.html 是否存在
   - 访问 https://www.houseplus.com.ng/404.html
   - 应该返回 200 状态码

4. 清除浏览器缓存
   - 按 Ctrl+Shift+Delete（Windows）或 Cmd+Shift+Delete（Mac）
   - 清除所有缓存
   - 重新访问页面

5. 等待 DNS 生效
   - GitHub Pages 部署后可能需要 5-30 分钟才能生效
   - 使用 https://www.whatsmydns.net/ 检查 DNS 状态

### 问题 2：页面加载缓慢

**症状：** 页面加载需要很长时间

**排查步骤：**

1. 检查网络速度
   - 使用 https://www.speedtest.net/ 测试网络速度

2. 检查页面大小
   - 打开浏览器开发者工具 → Network 标签
   - 刷新页面
   - 查看 index.html 的大小（应该 < 400KB）

3. 优化资源
   - 压缩 JavaScript 和 CSS
   - 优化图片大小
   - 启用 Gzip 压缩

### 问题 3：Google 仍未索引页面

**症状：** GSC 显示页面未被索引

**排查步骤：**

1. 检查 robots.txt
   - 确保页面未被 Disallow

2. 检查 noindex 标签
   - 打开页面源代码
   - 搜索 "noindex"
   - 如果存在，删除它

3. 检查 canonical 标签
   - 每个页面应该有 canonical 标签
   - Canonical 应该指向正确的 URL

4. 请求重新索引
   - 在 GSC 中使用 "URL 检查" 工具
   - 点击 "请求编入索引"

5. 等待 Google 爬取
   - Google 通常在 24-48 小时内重新爬取
   - 可以在 GSC 的 "覆盖率" 中查看进度

---

## ✨ 成功标志

当以下所有条件都满足时，说明 SPA 路由已成功实施：

- ✅ 所有 10 个页面都能通过直接 URL 访问
- ✅ 地址栏显示正确的路由（不会变成查询参数）
- ✅ HTTP 状态码为 200（不是 404）
- ✅ 页面间导航平滑，无刷新
- ✅ Google Search Console 显示所有页面都已索引
- ✅ 搜索结果中能显示所有页面

---

## 📞 支持和联系

- **技术问题：** 联系开发团队
- **SEO 问题：** 联系 SEO 团队
- **一般查询：** contact@houseplus.com.ng

---

**最后更新：2026-03-31**  
**维护者：House Plus Group Development Team**
