# ✅ 已完成迁移（2026-11-12）

> **本页下方是历史说明，实际部署已完成，无需再按步骤创建项目。**
>
> | 项 | 值 |
> |---|---|
> | Cloudflare 账号 | `affca529f7b55b7eb2b3770c954bd36d`（持有 `houseplus.com.ng` zone） |
> | Pages 项目 | `houseplus-group-ng` |
> | 预览域名 | https://houseplus-group-ng.pages.dev |
> | 正式域名 | https://www.houseplus.com.ng |
> | 部署方式 | **Direct Upload**（`wrangler pages deploy docs`），不连 Git、不跑构建 |
> | DNS | `www` CNAME → `houseplus-group-ng.pages.dev`，橙色云 |
> | 自定义域状态 | active，证书已签发 |
>
> 线上实测：CSP / X-Frame-Options / HSTS 全部生效，`/assets/*` 永久缓存，
> 未知路径返回真正的 404，`/admin/` 返回 200 且 `noindex`，全站字体自托管。
>
> **以后更新站点（两步，因为是 Direct Upload 项目，不连 Git）**：
> ```bash
> npm run build                       # 生成 docs/
> git add -A && git commit -m "..." && git push
> CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=affca529f7b55b7eb2b3770c954bd36d \
>   npx wrangler pages deploy docs --project-name houseplus-group-ng --branch main
> ```
> 只 `git push` 不会更新线上，必须再跑一次 `wrangler pages deploy`。
>
> **为什么没连 Git**：同一个 GitHub 仓库不能同时绑定到两个 Cloudflare 账号的 Pages
> 项目（错误 `8000093`）。旧账号 `5cd2f278…` 的 `houseplus-group-nigeria` 占着
> `WS006/House-Plus-Group`，所以新项目只能用 Direct Upload。若想恢复 push 自动部署：
> 先在旧账号删除那个项目释放仓库占用，再在账号 A 新建一个连 Git 的项目，构建命令留空、
> 输出目录 `docs`。
>
> **GitHub Pages 暂时保留**：DNS 已切走，它不再接收流量，但留着可在一分钟内把 CNAME
> 改回 `ws006.github.io` 完成回滚。确认 Pages 稳定运行一周后再关闭它。
>
> 旧账号 `5cd2f278…` 里的 `houseplus-group-nigeria` 项目已弃用，可自行删除。

---

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

## 四、账号与跨域名的实际情况（已核实，2026-11-12）

通过 Cloudflare API 实测确认：

```txt
zone houseplus.com.ng  ->  account affca529f7b55b7eb2b3770c954bd36d
Pages 项目 houseplus-group-nigeria ->  account 5cd2f2781f30e866504997ad801d7dbd
www.houseplus.com.ng   ->  CNAME ws006.github.io (proxied=true, 仍在 GitHub Pages)
```

**两个账号不同**。现有 Pages 项目已经连着正确的仓库 `WS006/House-Plus-Group`，但它在另一个账号里，所以：

- 在账号 B 里给项目绑定 `www.houseplus.com.ng` 会触发 `Error 1014 CNAME Cross-User Banned`（橙色云指向另一个账号的 zone）
- 用灰色云 DNS-only CNAME 指向 `houseplus-group-nigeria.pages.dev` 可以工作，但会失去 zone 账号里的 WAF / 缓存规则
- apex `houseplus.com.ng` 官方要求必须与 Pages 项目同账号

**推荐做法**：在持有 zone 的账号（`affca529…`）里新建同名的 Pages 项目，连同一个 GitHub 仓库。项目本身不保存内容，站点内容全在仓库的 `docs/` 目录，所以「等效重建」与复制效果一致，不需要也不能跨账号复制项目。

### API Token 权限

自动化创建项目需要 **`Account · Cloudflare Pages: Edit`** 权限，并且 token 必须属于目标账号。当前对话里出现过的 token 只有 Zone / DNS 权限，实测：

```txt
GET  /accounts/{acct}/pages/projects  -> 403 Authentication error
POST /accounts/{acct}/pages/projects  -> 403 Authentication error
```

因此创建项目这一步要么在 Dashboard 里做（不需要 API Key），要么换一个带 Pages:Edit 权限的 token。

### 当前最紧急的问题：部署全部失败

Dashboard 显示 `9b3faf3`、`cd7c83c`、`79d7b0a`、`4be68a4`、`490032d` 五次部署均为 `No deployment available`，只有 11-11 的 `ac22eeb` 成功。所以 `pages.dev` 上现在跑的还是旧站点（Google Fonts、无 h1、所有路径回退到同一个 6394 字节 HTML）。

原因是项目配置了构建命令，而 CI 无 Chromium 导致预渲染失败。**修复方式就是第三节的「构建命令留空、输出目录 `docs`」**，改完后 Retry deployment。

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
