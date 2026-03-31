# House Plus Group - SEO 优化指南

## 当前 SEO 配置状态

### ✅ 已完成的优化

1. **Sitemap 配置**
   - ✅ sitemap.xml - 包含 GEO 标签、hreflang、priority、lastmod
   - ✅ robots.txt - 指向 sitemap.xml

2. **结构化数据**
   - ✅ Schema.org JSON-LD - 所有页面
   - ✅ Open Graph 元标签 - 社交媒体分享优化
   - ✅ Twitter Card 标签 - Twitter 分享优化

3. **SPA 路由优化**
   - ✅ spa-github-pages 方案 - 快速重定向
   - ✅ 404.html 加载动画 - 用户体验优化

### ⚠️ 需要处理的问题

**GitHub Pages 404 状态码问题：**
- GitHub Pages 服务器层面返回 404 状态码
- Google 爬虫可能不认为这些页面有效
- 需要在 Google Search Console 中手动提交页面

## 解决方案

### 1. 添加 Canonical 标签（防止重复内容）

由于 spa-github-pages 会产生两个 URL 形式：
- `/factory` (用户看到的)
- `/?p=factory` (重定向中间状态)

需要在每个页面的 HTML head 中添加 canonical 标签：

```html
<link rel="canonical" href="https://www.houseplus.com.ng/factory" />
```

**实施位置：** `client/src/lib/seo.ts` 中的 `updateMetaTags` 函数

### 2. Google Search Console 手动提交

**步骤：**

1. 登录 Google Search Console: https://search.google.com/search-console
2. 选择属性 "www.houseplus.com.ng"
3. 进入 "URL 检查" 工具
4. 逐个提交以下 URL：
   ```
   https://www.houseplus.com.ng/
   https://www.houseplus.com.ng/about
   https://www.houseplus.com.ng/products
   https://www.houseplus.com.ng/factory
   https://www.houseplus.com.ng/team
   https://www.houseplus.com.ng/services
   https://www.houseplus.com.ng/faq
   https://www.houseplus.com.ng/news
   https://www.houseplus.com.ng/careers
   https://www.houseplus.com.ng/contact
   ```
5. 对每个 URL 点击 "请求编入索引"

### 3. 监测索引状态

**在 Google Search Console 中：**

1. 进入 "覆盖率" 报告
2. 查看哪些页面已被索引
3. 查看错误和警告
4. 定期检查（每周一次）

### 4. 提交 Sitemap

1. 在 GSC 中进入 "Sitemaps"
2. 提交 `https://www.houseplus.com.ng/sitemap.xml`
3. 检查是否被识别

## 预期结果

- **短期（1-2 周）：** Google 爬虫开始识别所有页面
- **中期（2-4 周）：** 所有页面开始在 Google 搜索结果中出现
- **长期（1-3 个月）：** 排名逐步提升

## 后续优化建议

1. **定期更新 News 页面** - 增加新鲜内容，提高网站权重
2. **添加内部链接** - 在相关页面之间建立链接
3. **优化页面加载速度** - 使用 Google PageSpeed Insights
4. **收集用户反馈** - 使用 Google Search Console 的数据改进内容

## 技术细节

### Sitemap 配置

当前 sitemap.xml 包含：
- **GEO 标签** - Lagos, Nigeria 坐标 (6.6349°N, 3.3519°E)
- **hreflang 标签** - 6 种语言版本 (EN, ZH, FR, RU, ES, AR)
- **Priority** - 主页 1.0，产品页 0.95，其他 0.6-0.85
- **Changefreq** - 主页/产品/新闻 weekly，其他 monthly

### robots.txt 配置

- 允许所有爬虫访问
- 屏蔽恶意爬虫 (MJ12bot, AhrefsBot, SemrushBot)
- 指向 sitemap.xml
- 设置爬虫延迟和请求频率

## 常见问题

**Q: 为什么 Google Search Console 显示 404 错误？**
A: 这是 SPA 应用在 GitHub Pages 上的正常现象。通过手动提交 URL 和提交 Sitemap，Google 会逐步识别这些页面。

**Q: 需要多长时间才能看到排名提升？**
A: 通常需要 2-4 周 Google 才能完全索引所有页面。排名提升需要 1-3 个月。

**Q: 如何加速索引？**
A: 在 Google Search Console 中手动提交 URL，并定期发布新内容。

---

**最后更新：** 2026-03-31
**维护人员：** Manus AI
