# Google Search Console (GSC) 提交指南

## 📋 概述

本指南说明如何在 Google Search Console 中提交 House Plus Group 网站，以确保所有页面被正确索引。

---

## 🔧 前置条件

1. **Google 账号** - 用于访问 Google Search Console
2. **网站所有权验证** - 需要验证 houseplus.com.ng 的所有权
3. **Sitemap 已准备** - 位置：`https://www.houseplus.com.ng/sitemap.xml`

---

## ✅ 步骤 1：验证网站所有权

### 方法 A：DNS 记录验证（推荐）

1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 点击 **"添加资源"** → 选择 **"网址前缀"**
3. 输入：`https://www.houseplus.com.ng`
4. 选择 **"DNS 记录"** 验证方法
5. 复制 Google 提供的 TXT 记录
6. 登录 Cloudflare → 选择 houseplus.com.ng 域名
7. 进入 **DNS** 设置 → 添加 TXT 记录
8. 粘贴 Google 提供的 TXT 记录
9. 返回 GSC 点击 **"验证"**

### 方法 B：HTML 文件验证

如果 DNS 验证失败：

1. 下载 Google 提供的 HTML 文件
2. 上传到 `client/public/` 目录
3. 提交验证

---

## 📝 步骤 2：提交 Sitemap

### 自动提交 Sitemap

1. 在 GSC 中打开已验证的资源
2. 左侧菜单 → **"Sitemaps"**
3. 点击 **"新增 Sitemap"**
4. 输入 Sitemap URL：`https://www.houseplus.com.ng/sitemap.xml`
5. 点击 **"提交"**

### 验证 Sitemap 状态

- **成功** ✅：显示 "成功" 状态，表示 Google 已接受
- **部分成功** ⚠️：某些 URL 可能有问题，检查错误详情
- **失败** ❌：检查 Sitemap 格式或 URL 是否正确

---

## 🔍 步骤 3：手动提交页面（可选但推荐）

### 提交所有 10 个公开页面

在 GSC 的 **"URL 检查"** 工具中，逐个提交以下页面：

| 页面 | URL |
|------|-----|
| Home | `https://www.houseplus.com.ng/` |
| About | `https://www.houseplus.com.ng/about` |
| Products | `https://www.houseplus.com.ng/products` |
| Factory | `https://www.houseplus.com.ng/factory` |
| Team | `https://www.houseplus.com.ng/team` |
| Services | `https://www.houseplus.com.ng/services` |
| FAQ | `https://www.houseplus.com.ng/faq` |
| News | `https://www.houseplus.com.ng/news` |
| Careers | `https://www.houseplus.com.ng/careers` |
| Contact | `https://www.houseplus.com.ng/contact` |

### 提交步骤

1. 打开 GSC 资源
2. 点击顶部 **"URL 检查"** 输入框
3. 输入页面 URL
4. 点击 **"请求编入索引"**
5. Google 会在几小时内爬取该页面

---

## 📊 步骤 4：监控索引进度

### 检查索引覆盖率

1. GSC 左侧菜单 → **"覆盖率"**
2. 查看以下指标：
   - **有效** ✅：已成功索引的页面
   - **警告** ⚠️：已索引但有问题
   - **错误** ❌：未能索引的页面
   - **已排除** ⊘：被 robots.txt 或 noindex 排除

### 解决常见问题

| 问题 | 原因 | 解决方案 |
|------|------|--------|
| 404 错误 | 页面返回 404 状态码 | 检查 GitHub Pages SPA 路由配置 |
| 重定向错误 | 页面重定向链过长 | 检查 404.html 重定向逻辑 |
| 爬虫无法访问 | robots.txt 阻止了爬虫 | 检查 robots.txt 配置 |
| 页面未索引 | 内容不足或重复 | 增加独特内容，检查 canonical 标签 |

---

## 🎯 步骤 5：优化搜索外观

### 添加结构化数据

✅ **已完成**：Home 和 Products 页面已添加 Schema.org 数据

### 添加网站链接搜索框

1. GSC → **"搜索外观"** → **"网站链接搜索框"**
2. 启用网站链接搜索框
3. 输入搜索 URL：`https://www.houseplus.com.ng/products?q={search_term}`

---

## 📈 步骤 6：监控性能

### 定期检查

每周检查以下指标：

1. **"性能"** 标签
   - 点击次数和展示次数
   - 平均排名和点击率
   - 哪些页面获得最多流量

2. **"体验"** 标签
   - 核心网页生命周期 (Core Web Vitals)
   - 移动可用性
   - 安全问题

3. **"增强"** 标签
   - 结构化数据错误
   - 移动可用性问题

---

## 🚀 预期时间表

| 操作 | 时间 |
|------|------|
| DNS 验证 | 5-30 分钟 |
| Sitemap 接受 | 1-2 小时 |
| 首次爬取 | 1-24 小时 |
| 完整索引 | 2-7 天 |
| 搜索结果显示 | 1-4 周 |

---

## ✨ 最佳实践

### 1. 定期更新内容
- 定期发布新闻和产品更新
- 更新页面内容时，Google 会自动重新爬取

### 2. 保持链接结构清晰
- ✅ 已完成：所有页面都有正确的 canonical 标签
- ✅ 已完成：sitemap.xml 包含所有页面

### 3. 监控爬虫错误
- 定期检查 GSC 的 **"爬虫统计信息"**
- 如果有 4xx 或 5xx 错误，立即修复

### 4. 提交更新
- 发布新页面或重要更新后，立即在 GSC 中提交
- 使用 **"请求编入索引"** 加速索引过程

---

## 🔗 有用的链接

- [Google Search Console](https://search.google.com/search-console)
- [Sitemap 协议](https://www.sitemaps.org/)
- [Schema.org 文档](https://schema.org/)
- [Google 搜索中心](https://developers.google.com/search)

---

## 📞 故障排除

### 问题：Sitemap 显示 "无法获取"

**解决方案：**
1. 检查 Sitemap URL 是否正确
2. 验证 Sitemap 文件是否有效（使用 [XML 验证工具](https://www.xmlvalidation.com/)）
3. 检查 robots.txt 是否允许访问 sitemap.xml
4. 等待 5-10 分钟后重试

### 问题：页面显示 404 错误

**解决方案：**
1. 手动访问页面 URL，确认页面可访问
2. 检查 GitHub Pages SPA 路由配置
3. 验证 404.html 重定向逻辑
4. 在 GSC 中使用 **"请求编入索引"** 重新提交

### 问题：页面已索引但不显示在搜索结果中

**解决方案：**
1. 检查页面是否被 noindex 标签排除
2. 验证页面内容是否足够独特
3. 检查是否有 canonical 标签指向其他页面
4. 等待 2-4 周，Google 需要时间评估页面质量

---

## 📋 检查清单

在提交到 Google 之前，确保完成以下所有项目：

- [ ] 网站所有权已在 GSC 中验证
- [ ] Sitemap 已提交并显示 "成功" 状态
- [ ] 所有 10 个页面都可以通过 HTTPS 访问
- [ ] 所有页面都有正确的 canonical 标签
- [ ] robots.txt 允许 Google 爬虫访问
- [ ] 页面加载速度良好（< 3 秒）
- [ ] 移动设备上页面显示正确
- [ ] 所有链接都有效（无 404 错误）
- [ ] 页面包含足够的原创内容
- [ ] 社交媒体链接已添加到页脚

---

**最后更新：2026-03-31**
**维护者：House Plus Group SEO Team**
