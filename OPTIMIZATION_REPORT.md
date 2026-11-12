# HousePlus Group Nigeria 网站优化报告

**更新日期**：2026-11-12
**线上地址**：https://www.houseplus.com.ng
**当前提交**：`79d7b0ab`（GitHub Pages，`main:/docs`）
**下一步**：迁移到 Cloudflare Pages，见 [CLOUDFLARE_PAGES_DEPLOYMENT.md](./CLOUDFLARE_PAGES_DEPLOYMENT.md)

---

## 一、已完成的修复

### P0 严重问题

| # | 问题 | 处理 |
|---|------|------|
| 1 | `/admin` 页面与打包文件里出现明文密码 | 移除页面提示；改为 SHA-256 摘要比对；构建产物无明文密码；`/admin` 输出 `noindex, nofollow` |
| 2 | 询价/联系表单只写 localStorage，线索从未发出 | 新增 `client/src/lib/forms.ts`：默认 POST 到 FormSubmit 中继，失败自动降级打开邮件客户端；提交结果如实提示访客 |
| 3 | **`/admin` 路由实际是坏的**（GitHub Pages 404、Pages 308 跳首页） | 生成真实静态文件 `docs/admin/index.html`，两种托管都正常，SPA 正常 hydrate |
| 4 | 安全响应头全缺 | 整理出 `_headers`（CSP/HSTS/X-Frame-Options 等）。GitHub Pages 忽略该文件，需迁移到 Cloudflare Pages 才生效 |

### P1 SEO / 抓取

| # | 问题 | 处理 |
|---|------|------|
| 5 | 24 个页面预渲染后 `#root` 为空 | 用无头 Chromium 真实渲染后写回 HTML：首页正文约 4.6k 字符、每页 1 个 `h1` |
| 6 | 预渲染缺浏览器时静默产出空页面 | 现在直接 `exit 1`，不再「构建成功但 24 页空白」 |
| 7 | 产品 Schema 缺 `sku`/`offers`；`og:type` 不对 | 补齐 `sku`、`offers`、`brand`、`parentOrganization`；产品页 `og:type=product` |
| 8 | 标题/描述超长，且在两处各存一份 | 统一到 `shared/routes.meta.json`；标题 ≤60、描述 70–160 字符 |
| 9 | 切换语言后站内链接丢失 `?lang=` | `LanguageContext.withLang()`，导航栏内链自动携带 |
| 10 | 404 与首页内容相同且可索引 | 生成真正 `404.html`（`noindex, follow`、无 canonical、含返回首页链接） |
| 11 | **soft 404**：`_redirects` 的 `/* /index.html 200` 让未知 URL 返回 200 + 首页 | 移除兜底规则；所有路由都是真实文件，交给 Pages 原生 404 |
| 12 | 移除 hreflang | 单页面 + `?lang=` 客户端渲染，删除互相矛盾的 hreflang 标注 |

### P2 性能 / 资源

| # | 问题 | 处理 |
|---|------|------|
| 13 | 图片 3.84 MB、无响应式、无宽高 | 生成 480/768/1200/1800 四档 WebP；`ResponsiveImage` 输出 `<picture>` + `srcset` + 固有宽高；首屏 preload |
| 14 | **Google Fonts 在中国大陆不可达**，且是阻塞请求 | 自托管 Barlow 7 个字重（156 KB），移除 `fonts.googleapis.com`；`@font-face` 内联进主 CSS |
| 15 | **字体换入导致 CLS 0.076** | 加入度量匹配的 `Barlow Fallback`（`size-adjust` 等实测值），换字不再重排；CLS 降至 0.000 |
| 16 | 淡入动画从 `opacity:0` 起步，把已渲染内容藏起来并推迟 LCP | 改为只隐藏启动时仍在视口下方的元素；首屏轮播/网格不做入场动画 |
| 17 | LCP preload 与 `<picture>` 选中不同变体，下载两份并重复绘制 | preload 直接读取渲染后 `<img>` 的 `srcset/sizes` |
| 18 | 缓存头叠加冲突 | `/*` 不再设 Cache-Control；按目录拆分为 `/assets/*` 1 年 immutable、`/images/*` 7 天、`/fonts/*` 30 天 |
| 19 | favicon 404；robots.txt 指令位置无效；sitemap lastmod 写死 | 生成多尺寸 favicon + manifest；重写 robots；sitemap lastmod 按文件 mtime |
| 20 | 社交卡片被裁切 | 生成 17 张 1200×630 `og/*.jpg` |

### P3 代码健康度

| # | 问题 | 处理 |
|---|------|------|
| 21 | 产品数据两处维护 | `tools/generate-product-data.mjs` 从 `store.ts` 派生 JSON |
| 22 | `server/` 死代码、`npm start` 指向不存在文件 | 删除 `server/`；`npm start` 改为 `vite preview` |
| 23 | 依赖混入未用包、缺 sharp/puppeteer | 清理并补齐 |
| 24 | **构建产物从未发布**（Pages 读 `docs/`，构建输出到 `dist/public`） | `tools/publish-docs.mjs` 接入 `npm run build`，自动镜像 |

### 可访问性

skip-link、全局 `:focus-visible` 焦点环、`prefers-reduced-motion`、图标按钮 `aria-label`、表单 `label htmlFor` + `id`。

---

## 二、性能实测

模拟 4G 手机（1.6 Mbps、CPU 4× 降速），5 次取中位数：

| 页面 | 优化前 LCP | 现在 LCP | CLS |
|---|---|---|---|
| 首页 | 3364 ms | 1604 ms | 0.010 → 0.003 |
| 产品列表 | 2404 ms | 1380 ms | 0.085 → 0.000 |
| 产品详情 | 2172 ms | 956 ms | 0.001 |
| 桌面首页 | 1412 ms | 656 ms | 0.000 |

线上实测（跨境直连 GitHub Pages）LCP 中位数 2.5–3.0 s，CLS 0.000。差距来自源站跨境延迟，迁移到 Cloudflare Pages 后可进一步改善。

`/about/` 的 LCP 约 2.4–2.8 s，瓶颈是 127 KB 主 JS 包，尚未做代码分割。

---

## 三、线上验证结果

```
24 条路由：200，正文 >400 字符，均有 h1 / canonical / og:image / 结构化数据
/              200  index, follow   h1=1
/products/     200  index, follow   h1=1
/about/        200  index, follow   h1=1
/admin         200  noindex, nofollow
/admin/        200  noindex, nofollow
未知路径       404  noindex, follow  h1=1，含返回首页链接
全站无 Google Fonts 引用，字体自托管
WebP / OG 卡片 / manifest / sitemap(24 URL, 22 图片) 均 200
```

Cloudflare Pages 本地预检（`wrangler pages dev docs`）：11 项路由全通过、缓存头均为单值、4 个安全头齐全、CSP 零违规、首页 11 张图片滚动后全部加载。

---

## 四、仍需你处理

1. **创建 Cloudflare Pages 项目**：步骤见 [CLOUDFLARE_PAGES_DEPLOYMENT.md](./CLOUDFLARE_PAGES_DEPLOYMENT.md)。构建命令**必须留空**，输出目录填 `docs`。不需要 API Key。
   - 若 Pages 项目与 `houseplus.com.ng` zone 不在同一账号：apex 不支持，子域橙色云会报 `Error 1014`。建议同账号。
2. **FormSubmit 激活**：表单已向 `jack@houseplus-ch.com` 发送激活邮件，点一次「Activate Form」后才真正投递。激活前自动降级为邮件客户端，不丢线索。换通道可设 `VITE_FORM_ENDPOINT` 后重新构建。
3. **令牌吊销**：对话中出现过的两个令牌请尽快重置：
   - GitHub PAT（`ghp_6GN…`）
   - Cloudflare API Token（`cfut_S4c…`）
4. **AI 写实图**：生图服务余额不足，当前使用 Pexels/Unsplash 实拍图自托管于 `client/public/images/`，可随时替换（需重新生成 WebP 变体与 OG 卡片）。
5. **待办**：`/about/` 的 127 KB 主 JS 包代码分割。

---

## 五、构建与发布

```bash
npm install --legacy-peer-deps   # Manus Vite 插件 peer 范围冲突，必须加此参数
npm run build                    # 产品数据 → 图片优化 → manifest → OG → favicon
                                 # → vite build → 预渲染 → sitemap → 发布到 docs/
npm run check                    # TypeScript
npx wrangler pages dev docs      # 本地按 Pages 规则预检
```

`npm run build` 需要本机有 Chrome/Edge（预渲染用）；缺浏览器会直接报错退出。发布：`git push` 即可，Pages 会从 `docs/` 自动部署。
