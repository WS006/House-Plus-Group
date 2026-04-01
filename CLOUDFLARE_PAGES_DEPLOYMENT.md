# Cloudflare Pages 部署完整指南

## 为什么选择 Cloudflare Pages？

**Cloudflare Pages 相比 GitHub Pages 的优势：**
- ✅ 原生支持 SPA 路由（无需额外配置）
- ✅ 自动处理 404 重定向到 index.html
- ✅ 更快的全球 CDN 速度
- ✅ 免费 SSL/TLS 证书
- ✅ 支持自定义域名
- ✅ 自动部署（每次 push 到 GitHub 时）
- ✅ 无需手动配置 Worker

## 第一步：登录 Cloudflare Dashboard

1. 打开浏览器，访问 [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. 输入你的 Cloudflare 账户邮箱和密码
3. 点击 **Sign In** 登录

## 第二步：进入 Pages 部分

1. 登录成功后，在左侧菜单中找到 **Workers & Pages**
2. 点击 **Pages** 标签（不是 Workers）
3. 点击 **Create application** 按钮

## 第三步：选择部署方式

你会看到几个选项，选择 **Connect to Git**：

1. 点击 **Connect to Git** 按钮
2. 系统会要求你选择 Git 提供商，选择 **GitHub**
3. 如果还没有授权，会跳转到 GitHub 授权页面
4. 点击 **Authorize Cloudflare** 授权 Cloudflare 访问你的 GitHub 账户

## 第四步：选择 GitHub 仓库

1. 授权完成后，返回 Cloudflare Pages
2. 你会看到一个仓库列表
3. 找到 **houseplus-website** 仓库
4. 点击它选择

**如果看不到你的仓库：**
- 点击 **Install Cloudflare Pages** 按钮
- 在 GitHub 上选择 **Only select repositories**
- 勾选 **houseplus-website**
- 点击 **Install**

## 第五步：配置构建设置

选择仓库后，你会看到构建配置页面。按照以下设置：

### 项目名称
- **Project name**: `houseplus-website`（或任何你喜欢的名称）

### 构建设置

**Framework preset**: 选择 **Vite**

**Build command**: 输入以下命令
```
npm run build
```

**Build output directory**: 输入以下路径
```
dist/public
```

**Root directory**: 留空（默认）

### 环境变量（可选）

如果你的构建需要环境变量，可以在这里添加。对于这个项目，通常不需要。

## 第六步：部署

1. 检查所有设置是否正确
2. 点击 **Save and Deploy** 按钮
3. Cloudflare 会开始构建你的项目
4. 等待部署完成（通常需要 2-5 分钟）

**部署过程中：**
- 你会看到一个进度条
- 可以点击 **View build log** 查看构建日志
- 如果有错误，日志会显示具体信息

## 第七步：获取临时 URL

部署完成后，你会看到一个临时 URL，格式如下：
```
https://houseplus-website.pages.dev
```

**测试临时 URL：**
1. 访问 `https://houseplus-website.pages.dev/privacy`
2. 应该能看到 Privacy Policy 页面内容
3. 访问 `https://houseplus-website.pages.dev/terms`
4. 应该能看到 Terms of Service 页面内容

## 第八步：配置自定义域名

现在将你的自定义域名 `www.houseplus.com.ng` 指向 Cloudflare Pages：

### 方法 1：使用 CNAME 记录（推荐）

1. 在 Cloudflare Pages 项目中，进入 **Settings** > **Domains**
2. 点击 **Add custom domain**
3. 输入 `www.houseplus.com.ng`
4. 点击 **Continue**
5. Cloudflare 会显示一个 CNAME 记录：
   ```
   CNAME: www.houseplus.com.ng
   Target: houseplus-website.pages.dev
   ```
6. 复制这个 CNAME 值
7. 登录你的 DNS 提供商（Cloudflare DNS）
8. 找到 DNS 记录管理
9. 修改或创建 `www` 的 CNAME 记录，指向 `houseplus-website.pages.dev`
10. 保存更改

**在 Cloudflare DNS 中的操作步骤：**
1. 进入 Cloudflare Dashboard
2. 选择你的域名 `houseplus.com.ng`
3. 进入 **DNS** 部分
4. 找到现有的 `www` 记录（应该指向 GitHub Pages）
5. 编辑这条记录
6. 将内容改为 `houseplus-website.pages.dev`
7. 点击 **Save**

### 方法 2：在 Cloudflare Pages 中添加域名

1. 在 Cloudflare Pages 项目设置中，进入 **Custom domains**
2. 点击 **Add domain**
3. 输入 `www.houseplus.com.ng`
4. 点击 **Continue**
5. Cloudflare 会自动配置（因为你的域名已经在 Cloudflare 上）

## 第九步：验证部署

配置完成后，验证一切是否正常工作：

### 测试 1：访问主页
```
https://www.houseplus.com.ng
```
应该显示主页内容

### 测试 2：测试 SPA 路由
访问以下 URL，都应该正常显示内容（不是 404）：
- `https://www.houseplus.com.ng/privacy`
- `https://www.houseplus.com.ng/terms`
- `https://www.houseplus.com.ng/about`
- `https://www.houseplus.com.ng/products`
- `https://www.houseplus.com.ng/factory`
- `https://www.houseplus.com.ng/team`
- `https://www.houseplus.com.ng/services`
- `https://www.houseplus.com.ng/faq`
- `https://www.houseplus.com.ng/news`
- `https://www.houseplus.com.ng/careers`
- `https://www.houseplus.com.ng/contact`

### 测试 3：检查 HTTP 状态码
1. 打开浏览器开发者工具（F12）
2. 进入 **Network** 标签
3. 访问 `/privacy` 页面
4. 查看请求的状态码，应该是 **200**（不是 404）

### 测试 4：验证 SSL 证书
1. 在浏览器地址栏中，应该看到一个绿色的锁图标
2. 点击锁图标，应该显示 SSL 证书有效

## 第十步：配置自动部署

Cloudflare Pages 默认已启用自动部署。这意味着：

1. 每当你 push 代码到 GitHub 的 `main` 分支时
2. Cloudflare 会自动触发构建和部署
3. 新版本会在 2-5 分钟内上线

**验证自动部署：**
1. 在 Cloudflare Pages 项目中，进入 **Deployments** 标签
2. 你会看到所有的部署历史
3. 最新的部署应该显示 "Success" 状态

## 第十一步：监控和维护

### 查看部署日志
1. 进入 **Deployments** 标签
2. 点击最新的部署
3. 点击 **View build log** 查看构建过程

### 设置通知
1. 进入 **Settings** > **Notifications**
2. 启用部署成功/失败的通知

### 查看分析
1. 进入 **Analytics** 标签
2. 查看流量、性能等数据

## 故障排除

### 问题 1：构建失败

**查看日志：**
1. 进入 **Deployments** 标签
2. 点击失败的部署
3. 查看 **Build log** 中的错误信息

**常见原因：**
- 依赖安装失败 → 检查 `package.json`
- 构建命令错误 → 确保使用 `npm run build`
- 输出目录错误 → 应该是 `dist/public`

### 问题 2：自定义域名不工作

**检查步骤：**
1. 确保 DNS 记录已正确配置
2. 等待 DNS 传播（通常 5-30 分钟）
3. 清除浏览器缓存
4. 在 Cloudflare Pages 中验证域名状态

### 问题 3：SPA 路由仍然返回 404

**解决方案：**
1. 确保 Cloudflare Pages 已启用 SPA 路由支持
2. 检查 `dist/public` 目录中是否有 `_redirects` 文件
3. 如果没有，创建 `_redirects` 文件，内容如下：
   ```
   /* /index.html 200
   ```
4. 重新部署

### 问题 4：静态资源无法加载

**检查步骤：**
1. 打开浏览器开发者工具
2. 查看失败的资源 URL
3. 确保资源在 `dist/public/assets/` 目录中
4. 清除 Cloudflare 缓存：
   - 进入 **Caching** > **Cache Purge**
   - 点击 **Purge Everything**

## 从 GitHub Pages 迁移

如果你之前使用 GitHub Pages，现在迁移到 Cloudflare Pages：

1. **保留 GitHub 仓库** — 继续使用 GitHub 作为代码存储
2. **禁用 GitHub Pages** — 进入仓库设置，禁用 GitHub Pages
3. **更新 DNS** — 将 `www` 记录从 GitHub Pages 改为 Cloudflare Pages
4. **删除 docs 文件夹** — 如果不再需要，可以删除 `docs` 文件夹

## 下一步

部署完成后：

1. **在 Google Search Console 中重新提交** — 告诉 Google 新的部署地址
2. **监控性能** — 使用 Cloudflare Analytics 跟踪流量和性能
3. **设置告警** — 配置部署失败的通知

---

**Cloudflare Pages 部署完成后，你的网站将获得：**
✅ 原生 SPA 路由支持
✅ 全球 CDN 加速
✅ 自动 SSL 证书
✅ 自动部署
✅ 更好的性能和可靠性
