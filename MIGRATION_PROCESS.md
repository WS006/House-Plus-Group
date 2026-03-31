# House Plus Group 网站迁移流程

## 📋 项目概述

本文档记录了 House Plus Group 网站从 GitHub Pages 迁移到 Manus 平台的完整流程，可作为其他类似项目的参考。

**项目信息：**
- **名称：** House Plus Group - Solar & Home Appliances & 3C Goods Manufacturer
- **原平台：** GitHub Pages (React SPA)
- **新平台：** Manus (全栈)
- **技术栈：** React 19 + TypeScript + TailwindCSS 4 + wouter 路由
- **多语言：** 6 种语言支持 (EN/ZH/FR/RU/ES/AR)
- **页面数：** 10 个公开页面

---

## 🚀 迁移步骤

### 第 1 步：代码集成

**操作：** 将 GitHub Pages 的 React 代码集成到 Manus 项目

1. 复制所有 React 组件和页面文件到 `client/src/`
2. 复制所有资源文件（图片、字体等）到 CDN（使用 `manus-upload-file --webdev`）
3. 更新所有图片路径为 CDN URL
4. 保留原有的路由结构和多语言系统

**关键文件：**
- `client/src/App.tsx` - 路由配置
- `client/src/contexts/LanguageContext.tsx` - 多语言管理
- `client/src/lib/i18n.ts` - 翻译字典

### 第 2 步：默认语言配置

**操作：** 设置网站默认显示英文

修改 `LanguageContext.tsx` 中的语言检测逻辑：

```typescript
// 从浏览器语言检测改为固定英文
return 'en';  // 默认英文
```

**原因：** 国际市场用户习惯使用英文作为默认语言

### 第 3 步：DNS 配置

**操作：** 更新 Cloudflare DNS 记录指向 Manus

**原配置（GitHub Pages）：**
```
A    houseplus.com.ng    185.199.108.153
A    houseplus.com.ng    185.199.109.153
A    houseplus.com.ng    185.199.110.153
A    houseplus.com.ng    185.199.111.153
```

**新配置（Manus）：**
```
CNAME    www.houseplus.com.ng    houseplus-fa3fqlnt.manus.space
```

**注意：** 删除所有旧的 A 记录，添加新的 CNAME 记录

### 第 4 步：SEO 优化 - Schema.org 结构化数据

**操作：** 为所有页面添加 JSON-LD 格式的结构化数据

创建 `client/src/lib/schema.ts` 包含以下函数：

- `generateOrganizationSchema()` - 组织信息
- `generateWebPageSchema()` - 网页信息
- `generateProductSchema()` - 产品信息
- `generateArticleSchema()` - 文章信息
- `generateBreadcrumbSchema()` - 面包屑导航
- `generateLocalBusinessSchema()` - 本地商业信息
- `injectSchema()` - 注入到页面
- `clearSchemaScripts()` - 清除重复的 Schema

**在每个页面中使用：**

```typescript
useEffect(() => {
  clearSchemaScripts();
  injectSchema(generateWebPageSchema({
    pageTitle: '页面标题',
    pageDescription: '页面描述',
    pageUrl: 'https://www.houseplus.com.ng/page'
  }));
  injectSchema(generateOrganizationSchema());
}, []);
```

### 第 5 步：社交媒体链接

**操作：** 在页脚添加社交媒体平台链接

更新 `Footer.tsx` 中的社交链接：

```typescript
// Facebook
https://www.facebook.com/houseplusgroup

// Instagram
https://www.instagram.com/houseplusgroup

// Twitter
https://twitter.com/houseplusgroup

// YouTube
https://www.youtube.com/@houseplusgroup

// LinkedIn
https://www.linkedin.com/company/house-plus-group
```

**实现方式：** 使用 `target="_blank" rel="noopener noreferrer"` 在新标签页打开

### 第 6 步：CDN 和缓存策略

**操作：** 配置 Manus 平台的 CDN 和缓存

**Manus 平台配置：**

1. **启用 CDN 加速：**
   - 进入项目设置 → CDN 配置
   - 启用全球 CDN 加速
   - 选择特定地区节点（重点关注非洲）

2. **缓存策略：**
   - **静态资源（图片、CSS、JS）：** 缓存 30 天
   - **HTML 页面：** 缓存 1 小时
   - **API 响应：** 不缓存或缓存 5 分钟

3. **压缩配置：**
   - 启用 Gzip 压缩
   - 启用 Brotli 压缩（支持现代浏览器）

4. **HTTP/2 推送：**
   - 启用 HTTP/2 Server Push
   - 推送关键 CSS 和字体文件

---

## 🔧 技术细节

### 多语言系统

**支持的语言：**
- English (en) - 默认
- 中文 (zh)
- Français (fr)
- Русский (ru)
- Español (es)
- العربية (ar) - RTL

**实现方式：**
- 使用 React Context 管理语言状态
- localStorage 持久化用户语言选择
- 动态翻译字典系统

### 路由结构

**公开页面：**
- `/` - 首页
- `/about` - 关于
- `/products` - 产品列表
- `/products/:id` - 产品详情
- `/factory` - 工厂
- `/team` - 团队
- `/services` - 服务
- `/faq` - 常见问题
- `/news` - 新闻
- `/careers` - 招聘
- `/contact` - 联系

**路由库：** wouter（轻量级客户端路由）

### 性能优化

1. **图片优化：**
   - 所有图片存储在 CDN
   - 使用 WebP 格式
   - 实现图片懒加载

2. **代码分割：**
   - 按页面分割代码
   - 异步加载组件

3. **缓存策略：**
   - 浏览器缓存
   - CDN 缓存
   - Service Worker 缓存

---

## 📊 迁移前后对比

| 项目 | GitHub Pages | Manus |
|------|--------------|-------|
| **部署时间** | 手动 Git push | 自动部署 |
| **SSL/TLS** | 自动 | 自动 |
| **CDN** | 无 | 全球 CDN |
| **性能** | 基础 | 优化 |
| **SEO** | 基础 | 增强 |
| **分析** | 需要集成 | 内置 |
| **备份** | Git 仓库 | 自动快照 |

---

## ✅ 验收清单

迁移完成后，需要验证以下项目：

- [ ] 所有 10 个页面可正常访问
- [ ] 多语言切换正常工作
- [ ] 默认语言为英文
- [ ] Schema.org 数据在页面源代码中
- [ ] 社交媒体链接可点击
- [ ] DNS 已生效（自定义域名可访问）
- [ ] SSL/TLS 证书有效
- [ ] 页面加载速度 < 3 秒
- [ ] 移动设备响应式布局正常
- [ ] Google Search Console 已更新

---

## 🔗 相关资源

- **Manus 文档：** https://docs.manus.im
- **Schema.org：** https://schema.org
- **wouter 路由：** https://github.com/molefrog/wouter
- **TailwindCSS 4：** https://tailwindcss.com

---

## 📝 注意事项

1. **DNS 生效时间：** 通常 5-30 分钟，最多 24 小时
2. **Google 索引更新：** 提交新 Sitemap 后 1-7 天
3. **社交媒体账户：** 需要提前创建对应的社交平台账户
4. **CDN 配置：** 建议在非高峰时段进行配置更改

---

**最后更新：** 2026-03-31
**维护者：** Manus AI
