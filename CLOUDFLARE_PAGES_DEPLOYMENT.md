# Cloudflare Pages 部署指南

**最后更新**：2026-11-12
**当前线上**：https://www.houseplus.com.ng（GitHub Pages，`main:/docs`，经 Cloudflare 代理）
**目标**：迁移到 Cloudflare Pages

---

## 一、为什么要迁移

`client/public/_headers` 和 `client/public/_redirects` 是 **Cloudflare Pages 的特性**，不是「Cloudflare 代理」的特性。当前链路是：

```
访客 → Cloudflare 代理（橙色云）→ GitHub Pages 源站
```

GitHub Pages 会忽略这两个文件，所以仓库里写好的 CSP、缓存策略、路由规则**从未生效**。实测线上响应头里没有 `Content-Security-Policy`。

迁移到 Pages 后，这些配置会自动生效：

| 能力 | GitHub Pages（现状） | Cloudflare Pages |
|---|---|---|
| CSP / X-Frame-Options / Referrer-Policy | 不生效 | 生效 |
| `/assets/*` 指纹文件永久缓存 | 统一 10 分钟 | `max-age=31536000, immutable` |
| 原生 404（非 soft 404） | 是 | 是 |
| 自动部署 | push 触发 | push 触发 |

---

## 二、关键约束：不能让 Pages 跑构建

`npm run build` 的最后一步 `prerender.mjs` 会用无头 Chromium 逐个渲染 24 个路由，把真实 HTML 写进静态文件。CI runner 没有浏览器。

旧版本在缺浏览器时会**静默降级**，产出 24 个空 `<div id="root">` 却报告构建成功。现在 `prerender.mjs` 会直接 `exit 1`（如需仅生成 head 元数据，用 `ALLOW_METADATA_ONLY=1`）。

**因此：构建在本地完成，产物提交到 `docs/`，Pages 只负责发布静态目录。**

`tools/publish-docs.mjs` 已接入 `npm run build`，自动把 `dist/public` 镜像到 `docs/`（并删除过期的哈希文件）。

本地发布流程：

```bash
npm install --legacy-peer-deps
npm run build        # 含预渲染 + 发布到 docs/
git add -A && git commit -m "..." && git push
```

---

## 三、创建 Pages 项目（Dashboard 操作，不需要 API Key）

1. 打开 https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 授权 GitHub，选择仓库 **`WS006/House-Plus-Group`**，分支 `main`
   （早期文档里写过另一个仓库名，均以此处为准）
3. 构建设置：

   | 字段 | 值 |
   |---|---|
   | Framework preset | **None** |
   | Build command | **留空** |
   | Build output directory | **`docs`** |
   | Root directory | 留空 |

4. 点 **Save and Deploy**
5. 项目 → **Custom domains** → **Set up a domain** → 填 `www.houseplus.com.ng`
6. 确认 DNS 记录指向 Pages，代理保持开启
7. 验证通过后，可选：在 GitHub 仓库 Settings → Pages 关闭 GitHub Pages

> **不要**在 Pages 里填 `npm run build`。CI 没有 Chromium，构建会失败。这是刻意的保护，不是 bug。

凭据：全程网页操作，只要你的 Cloudflare 账号对 `houseplus.com.ng` zone 有 Edit 权限即可。

---

## 四、跨 Cloudflare 账号的限制

如果 Pages 项目和 `houseplus.com.ng` zone **不在同一个 Cloudflare 账号**：

| 场景 | 结果 |
|---|---|
| 子域 `www` CNAME 指向外部 DNS | 可以 |
| 子域指向**另一个** CF 账号的 zone（橙色云） | **不行**，`Error 1014 CNAME Cross-User Banned` |
| 子域指向另一个账号 zone（灰色云 DNS-only） | 能用，但该 zone 的 WAF / 缓存规则不生效 |
| Apex `houseplus.com.ng` | **不行**，官方要求 apex zone 必须与 Pages 项目同账号 |

**建议**：把 Pages 项目建在持有 `houseplus.com.ng` zone 的那个账号里，这是唯一没有妥协的路径。

---

## 五、部署后验证

```bash
# 路由（含真实 404）
curl -I https://www.houseplus.com.ng/                       # 200
curl -I https://www.houseplus.com.ng/products/              # 200
curl -I https://www.houseplus.com.ng/admin/                 # 200, noindex
curl -I https://www.houseplus.com.ng/no-such-page/          # 404, noindex

# 缓存头必须是单值
curl -I https://www.houseplus.com.ng/assets/index-*.js      # max-age=31536000, immutable
curl -I https://www.houseplus.com.ng/                       # max-age=0

# 安全头
curl -I https://www.houseplus.com.ng/ | grep -i content-security-policy
```

本地可以用与 Pages 相同的路由/头引擎预检：

```bash
npx wrangler pages dev docs --port 4200
```

`wrangler.toml` 已配置 `pages_build_output_dir = "docs"`。

---

## 六、这些文件在做什么

| 文件 | 作用 |
|---|---|
| `client/public/_headers` → `docs/_headers` | CSP、安全头、按目录的缓存策略 |
| `client/public/_redirects` → `docs/_redirects` | **故意不含任何 rewrite 规则**（仅注释）。所有路由都是真实文件，兜底会把未知 URL 变成 soft 404 |
| `docs/404.html` | 原生 404 页，`noindex`、无 canonical、含返回首页链接 |
| `docs/admin/index.html` | 后台 SPA 外壳，`noindex, nofollow`，真实文件以兼容两种托管 |
| `tools/publish-docs.mjs` | 把 `dist/public` 镜像到 `docs/` |
| `wrangler.toml` | Pages 项目配置 |

### 为什么 `_redirects` 是空的

`/*  /index.html  200` 这种兜底会让不存在的 URL 返回 200 + 首页内容，即 **soft 404**。Google 会把它当成首页的重复内容，与真实页面争夺索引。现在 24 个路由全部预渲染成真实文件，未知路径交给 Pages 原生 404 即可。

---

## 七、关于 `cloudflare-worker.js`

仓库里保留了一份 Worker 实现作为**备选方案，当前未部署**，也不需要部署。它是早期「GitHub Pages + Worker」思路的产物；改用 Pages 后，`_headers` 已覆盖它的全部职责（安全头、缓存、404）。不要同时启用两者，避免头被重复设置。

之前 4 份互相冲突的 Worker 部署文档（`CLOUDFLARE_WORKER_*.md`、`CONFIGURE_WORKER_ROUTE.md`）已删除——它们描述的仓库名、构建设置和路由方案都是错的。
