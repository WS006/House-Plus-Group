# HousePlus Group（houseplus.com.ng）SEO / AEO / GEO 诊断与优化方案

- 检测日期：2026-11-15
- 检测对象：https://www.houseplus.com.ng（Cloudflare Pages，静态预渲染）
- 检测方式：线上抓取 24 个页面 + Lighthouse 12（移动端模拟）+ 逐页解析 head / JSON-LD / 标题层级 / 正文体量 / 资源体积
- 说明：本文件只做诊断与方案，不含任何编造的业务数据。凡是需要真实信息的地方都标了「待确认」。

---

## 0. 一句话结论

**技术底子已经很好，短板不在"能不能被收录"，而在"值不值得被引用"。**

Lighthouse 的 SEO 项是满分 100，canonical / 尾斜杠 / sitemap / 结构化数据 / SSR 预渲染都已到位。真正拉开差距的是三件事：

1. **实体不一致** —— 同一个公司在代码里有三套不同写法（地址、社媒、邮箱），搜索引擎和 AI 无法确认"这是同一家公司"。
2. **内容太薄** —— 产品页 220–240 词，类目页 322 词，全站没有一篇"解答型"长内容。
3. **AI 友好度为零** —— 没有 llms.txt，没有可引用的"事实块"，没有作者/更新时间，AI 抓得到但摘不出东西。

---

## 1. 体检数据（实测）

| 维度 | 结果 | 评价 |
|---|---|---|
| Lighthouse Performance | **85** | 及格，LCP 拖后腿 |
| Lighthouse Accessibility | **96** | 良好，对比度有 6 处不达标 |
| Lighthouse Best Practices | **93** | 良好，CSP 误伤自家分析脚本 |
| Lighthouse SEO | **100** | 优秀 |
| LCP / FCP | 3.1s / 1.8s | LCP 未达 2.5s 良好线 |
| CLS | **0** | 优秀 |
| TBT | 220ms | 可接受 |
| 首屏总字节 | 396 KiB | 合理 |
| HTML 服务端渲染 | 24/24 页正文都在 HTML 里 | 优秀（AI 与爬虫都能直接读） |
| 首字节 TTFB | 310ms（Cloudflare 边缘） | 优秀 |
| 压缩 | Brotli 已开启 | 优秀 |
| canonical 自指 | 24/24 正确 | 优秀 |
| 尾斜杠 | `/about` → 308 → `/about/` | 正确 |
| 主域归一 | apex 301 → www，http 301 → https | 正确 |
| 404 | 返回真实 404 状态 + noindex | 正确 |
| HSTS | `max-age=31536000; includeSubDomains; preload` | 优秀 |
| CSP | 已启用（但有误伤，见 2.2） | 良好 |
| sitemap | 24 URL + image sitemap | 良好（lastmod 有问题） |
| robots.txt | 允许全站，仅屏蔽 /admin/ 与 3 个垃圾爬虫 | 优秀 |
| llms.txt | **404（不存在）** | 缺失 |
| 结构化数据 | Organization / WebPage / Product / FAQPage / LocalBusiness / NewsArticle / JobPosting / Service / Person / ContactPoint | 覆盖广，但**字段有硬伤** |

---

## 2. 技术 SEO

### 2.1 已经做对、不要动的部分

- 所有内部链接统一尾斜杠形式，canonical 全部自指且与 sitemap 一致。
- 每个页面都有唯一 H1，标题与描述互不重复。
- 图片全部 WebP + `srcset` 响应式 + `width/height` 固定比例（所以 CLS 为 0）。
- 首屏 hero 图有 `preload` + `fetchpriority=high`，字体有 `preload`。
- 24 页全部服务端预渲染，禁用 JS 也能读到完整正文——这对 AI 抓取是决定性优势。
- 每页有独立 og:image（1200×630），社交分享卡片正常。

### 2.2 P0：必须修（直接影响收录、信任或数据）

| # | 问题 | 证据 | 影响 | 修法 |
|---|---|---|---|---|
| 1 | **CSP 把 Cloudflare Web Analytics 打死了** | 控制台报错：`Loading 'static.cloudflareinsights.com/beacon.min.js' violates CSP "script-src 'self' 'unsafe-inline'"` | 站点**没有任何真实流量数据**，后续所有 SEO 决策都是盲的 | `_headers` 的 CSP 增加 `script-src ... https://static.cloudflareinsights.com` 与 `connect-src ... https://cloudflareinsights.com` |
| 2 | **同一实体三套写法** | `index.html` 静态块：`addressLocality: "Lagos"`、sameAs 无 Instagram；`schema.ts`：`addressLocality: "Ikeja"`、sameAs 有 Instagram；`/factory/` 又写 `postalCode: 101233` | 搜索引擎与 AI 无法把三条记录归并为同一实体，E-E-A-T 直接受损 | 抽出唯一数据源（如 `client/src/lib/company.ts`），所有 JSON-LD、页脚、联系页都从它渲染 |
| 3 | **sitemap 的 lastmod 全是构建日期** | 24 条 URL 的 `<lastmod>` 全部是 `2026-11-15` | Google 判定"批量伪造更新时间"后会整体忽略 lastmod，等于没有 | 只在页面正文真正变化时输出 lastmod；或直接删掉 lastmod（比全站同日更安全） |
| 4 | **Product 的 Offer 没有 price** | 线上 `/products/solar-panel-mono-400w/`：`offers: {priceCurrency, availability, ...}`，无 `price` | Google 商品富结果要求 Offer 必须有 `price` 或 `priceSpecification`，现在等于白写 | 二选一：公开价格；或改用 `AggregateOffer` + `lowPrice`，或去掉 offers 只保留 Product（不报错但不展示富结果） |
| 5 | **NewsArticle 的日期是"今天"** | `schema.ts` 里 `datePublished: config.articlePublishedDate \|\| new Date().toISOString()` | 每次构建新闻都变成"刚发布"，属于新鲜度造假，Google 会降低信任 | 新闻数据里必须有真实日期字段，缺失时**不要输出** datePublished |
| 6 | **JobPosting 的薪资是字符串** | `baseSalary.price: "Competitive"` | schema.org 要求数值，Google 会报错并丢弃整条职位数据 | 填真实区间（`value: {minValue, maxValue, unitText}`），没有就删掉 baseSalary |

### 2.3 P1：应尽快修

| # | 问题 | 现状 | 建议 |
|---|---|---|---|
| 7 | LocalBusiness 缺关键字段 | 只有 name/address/telephone/priceRange/areaServed | 补 `geo`（经纬度）、`openingHoursSpecification`、`image`（实景图）、`hasMap`、`@id` |
| 8 | JSON-LD 没有 `@id` 图谱 | Organization、WebPage、LocalBusiness 各自独立，互不引用 | 改成单一 `@graph`：`Organization#org` ← `WebPage#page` ← `BreadcrumbList`，用 `@id` 串联 |
| 9 | 产品页没有 BreadcrumbList | 页面有面包屑 UI，但 JSON-LD 只有 Product / FAQPage / Organization | 加 `BreadcrumbList`（Home → Products → 产品） |
| 10 | 三个标题偏短 | `/products/air-fryer-5l/` 32 字符、`/products/solar-inverter-5kw/` 37、`/products/rice-cooker-5l/` 34 | 补品牌词 + 规格词，控制在 50–60 字符 |
| 11 | `/products/` 无 H2 | 整页只有 H1 + 12 个 H3 产品名 | 按三大类分组（Solar / Home Appliances / 3C），每组一个 H2 + 60–80 词导语 |
| 12 | FAQ 的问题不是标题 | 8 个问题包在 `<button>` 里，正文里没有 H2/H3 | 问题改成 `<h3>`（按钮里放 h3 是合法的），答案首句给 40–60 词直答 |
| 13 | 7 个资源缓存 TTL 偏短 | Lighthouse `uses-long-cache-ttl` | 静态资源统一 `max-age=31536000, immutable`（文件名已带 hash） |
| 14 | 图片 alt 偏泛 | 全部有 alt，但多为 "Solar panel" 级别 | 改成"描述 + 场景 + 地点"，如 "400W monocrystalline solar panel installed on a Lagos rooftop" |

### 2.4 P2：可选

- 探测显示只走 HTTP/1.1。Cloudflare 默认支持 h2/h3，建议在面板确认 **HTTP/3** 与 **0-RTT** 已开启（对移动端首屏有实际收益）。
- 404 页只有"页面不存在"，建议补 4 个热门产品 + 搜索框，把误入流量接住。
- 建议加 `/.well-known/security.txt`（低成本信任信号，非必需）。

---

## 3. 内容与关键词（经典 SEO 主战场）

### 3.1 现状

| 页面类型 | 数量 | 平均正文 | 问题 |
|---|---|---|---|
| 首页 | 1 | 680 词 | 尚可，但缺少"答案式"开头段 |
| 产品详情 | 12 | **220–240 词** | 严重偏薄，只有规格表 + 4 个相关产品 |
| 类目 /products/ | 1 | 322 词 | 无分组、无导语、无内链策略 |
| About / Factory / Services | 3 | 307–953 词 | About 尚可，Services 偏薄 |
| FAQ | 1 | 233 词 / 8 问 | 数量太少，长尾覆盖不足 |
| News | 1 列表 + 7 篇 | 393 词（列表） | 无发布日期，无单篇详情页 |
| 法务 / 团队 / 招聘 | 4 | 236–1029 词 | 正常 |

**结论：全站 24 页里，没有任何一页是"回答用户问题"的内容。** 这类内容恰恰是 Google 精选摘要、AI Overviews、Perplexity 引用率最高的部分。

### 3.2 关键词地图（建议）

| 意图 | 目标页 | 主关键词（示例） | 说明 |
|---|---|---|---|
| 交易型 | `/products/solar-panel-mono-400w/` | 400w solar panel price in Nigeria | 产品页补价格/报价、交期、质保 |
| 交易型 | `/products/solar/`（新建） | solar panels in Nigeria | 类目页承接"泛词" |
| 交易型 | `/products/home-appliances/`（新建） | home appliances Nigeria | 同上 |
| 交易型 | `/products/3c-electronics/`（新建） | 3C electronics supplier Nigeria | 同上 |
| 商业调研 | `/guides/solar-panel-price-nigeria/`（新建） | how much does a solar panel cost in Nigeria | 价格指南，最容易被 AI 引用 |
| 商业调研 | `/guides/how-to-size-a-solar-system/`（新建） | how many solar panels to power a house | 计算型内容 |
| 商业调研 | `/guides/inverter-vs-generator-nigeria/`（新建） | inverter vs generator cost Nigeria | 对比型内容 |
| 商业调研 | `/guides/lifepo4-vs-lead-acid-battery/`（新建） | LiFePO4 vs lead acid battery | 对比型内容 |
| B2B 采购 | `/services/oem-odm/`（拆页） | OEM solar products manufacturer China | 承接 OEM 询盘 |
| B2B 采购 | `/guides/importing-from-china-to-nigeria/`（新建） | import solar products from China to Nigeria | 高价值长尾 |
| 品牌/导航 | `/`、`/about/` | HousePlus Group Nigeria | 品牌词 |
| 本地 | `/contact/`、`/factory/` | solar company Ikeja Lagos | 本地意图 |

### 3.3 每个产品页的"最低合格线"

现在是 220 词，建议提到 **600–900 词**，结构固定为：

1. **一句话结论**（40–60 词，含型号、功率、适用场景、起订量）
2. **关键参数表**（已有，保留）
3. **适合谁 / 不适合谁**（AI 最爱摘这种对比）
4. **实际使用场景**（3 条，带地名，如"拉各斯 3 居室"）
5. **价格与交期**（哪怕只写"起订量 + 询价"，也要给出区间或说明）
6. **质保与认证**（真实认证才写）
7. **常见问题 3–5 条**（用 H3 问句，直接进 FAQPage schema）
8. **相关产品 / 上级类目 / 指南**（≥ 6 条内链）

### 3.4 内链规则

- 每个产品页：向上到类目、横向到 3 个相关产品、向下到 1 篇指南。
- 每篇指南：至少链 2 个产品页 + 1 个类目页。
- 首页：保留现有 27 条内链，新增"指南"区块。
- 目标：任意页面距首页 ≤ 3 次点击。

---

## 4. AEO（答案引擎优化）

AEO 的目标不是排名，而是**被选为"那个答案"**——精选摘要、People Also Ask、语音助手、AI Overviews 里的那一段。

### 4.1 现状问题

- FAQ 只有 8 条，且问题文本不是标题标签，机器难以判断"这是问题"。
- 答案没有统一句式，长度不一，没有"先给结论"。
- 全站没有可被整段抽取的事实表（价格区间、交期、MOQ、质保年限）。

### 4.2 具体做法

**(1) 问题即标题。** 每个 Q 用 `<h3>` 包问句，答案紧跟其后：

```
<h3>What is the minimum order quantity (MOQ)?</h3>
<p>HousePlus Group's MOQ is [待确认] units per SKU for stock items, and
[待确认] units for OEM/ODM orders with custom branding.</p>
```

**(2) 首句给答案，第二句才解释。** 40–60 词，包含数字、单位、货币、地点。AI 抽取时几乎只取第一句。

**(3) FAQ 从 8 条扩到 30+ 条**，按主题分组（每个主题一个 H2）：

| 分组 | 建议问题数 | 示例 |
|---|---|---|
| 价格与付款 | 6 | 一套 5kW 家用系统多少钱？支持哪些付款方式？是否含安装？ |
| 起订量与定制 | 6 | MOQ 多少？能否贴牌？能否改包装？打样周期多久？ |
| 物流与清关 | 6 | 到拉各斯要多久？运费怎么算？谁负责清关？ |
| 认证与质保 | 5 | 有哪些认证？质保几年？坏了怎么修？ |
| 产品技术 | 8 | 400W 板配多大逆变器？电池能循环多少次？阴天发电多少？ |

**(4) 每页加一个"Key facts"表格**（3–6 行），例如：

| Item | Value |
|---|---|
| MOQ | [待确认] |
| Lead time | [待确认] |
| Warranty | [待确认] |
| Payment terms | [待确认] |

表格是 AI 抽取率最高的结构，比段落高一个数量级。

**(5) 结构化数据**：FAQPage 保留并扩到 30 条（注意 Google 现在只对"权威站点"展示 FAQ 富结果，但 AI 引擎仍然读）；对比型内容用 `HowTo`（有明确步骤时）；不要滥用 `QAPage`（那是给用户问答社区的）。

---

## 5. GEO（生成式引擎优化）

GEO 的目标是：当用户在 ChatGPT / Perplexity / Gemini / Copilot / Claude 里问"尼日利亚哪家太阳能工厂靠谱"时，**被提到、被引用、被推荐**。

### 5.1 现状

| 项目 | 状态 |
|---|---|
| robots.txt 是否放行 AI 爬虫 | ✅ `User-agent: * / Allow: /`，GPTBot、PerplexityBot、ClaudeBot 都能进 |
| 正文是否在 HTML 里（无需 JS） | ✅ 预渲染，优势明显 |
| llms.txt | ❌ 不存在 |
| 实体是否唯一可识别 | ❌ 三套写法（见 2.2） |
| 是否有可引用的事实块 | ❌ 无 |
| 是否有作者 / 更新时间 | ❌ 无 |
| 是否有第三方提及（外链、目录、媒体） | ❓ 无法从站内判断，需站长提供 |

### 5.2 六项具体动作

**(1) 加 `llms.txt`（成本最低、见效最快）。** 放在站点根目录，纯文本，给 AI 一份"站点说明书"：

```
# HousePlus Group Nigerian Factory

> Nigerian branch of HousePlus Group (China). Supplies solar panels, inverters,
> batteries, home appliances and 3C electronics, factory-direct, with OEM/ODM.

## Core pages
- [About](https://www.houseplus.com.ng/about/): company, factory, team
- [Products](https://www.houseplus.com.ng/products/): full catalogue
- [Factory](https://www.houseplus.com.ng/factory/): manufacturing and QC
- [Services](https://www.houseplus.com.ng/services/): OEM/ODM, sourcing, logistics
- [FAQ](https://www.houseplus.com.ng/faq/): MOQ, payment, lead time, warranty
- [Contact](https://www.houseplus.com.ng/contact/): address, phone, email

## Key facts
- Legal name: [待确认]
- RC number: [待确认]
- Factory location: [待确认]
- Product lines: solar, home appliances, 3C electronics
- Markets: Nigeria, West Africa, global
```

**(2) 把 About 页升级成"实体主页"。** AI 判断一家公司是否可信，看的是：成立时间、工厂规模、产能、认证、客户类型、负责人。现在 About 有 953 词但缺硬指标。补一张事实表（全部待确认真实值）：

| 字段 | 值 |
|---|---|
| 成立年份 | 待确认 |
| 注册号（RC） | 待确认 |
| 工厂面积 | 待确认 |
| 年产能 | 待确认 |
| 员工数 | 待确认 |
| 认证 | 待确认（ISO / SONCAP / CE …） |
| 主要市场 | 待确认 |

**(3) 写"可被引用句"。** AI 引用的是**独立成句、自带主语和数字**的句子。对比：

- ❌ "我们提供高品质的太阳能产品，深受客户信赖。"
- ✅ "HousePlus Group's 400W monocrystalline panel uses 21% efficiency cells and ships with a 25-year performance warranty."（数字需真实）

规则：每页至少 3 句这样的"事实句"，放在段落开头，不依赖上下文。

**(4) 实体一致性（最重要，也最容易被忽略）。**
同一个公司在以下所有地方必须完全一致：站点 JSON-LD、页脚、联系页、Google Business Profile、LinkedIn、Facebook、Instagram、Alibaba/ TradeIndia 等 B2B 目录、新闻稿。**尤其是邮箱**——现在用的是 `jack@houseplus-ch.com`（中国域名），而站点是 `.com.ng`，AI 与用户都会怀疑"这是不是同一家"。建议启用 `@houseplus.com.ng` 域名邮箱（如 `sales@houseplus.com.ng`），全站统一。

**(5) 第三方提及（GEO 的真正杠杆）。** 生成式引擎的答案高度依赖"别处怎么说你"。优先级：
1. Google Business Profile（本地包 + AI Overviews 本地推荐）
2. LinkedIn 公司页（B2B 查询的高频信源）
3. 尼日利亚本地商业目录与行业协会
4. 行业媒体投稿 / 新闻稿（带真实数据，不要通稿）
5. 供应商目录（Alibaba 等）与客户案例

**(6) 允许但可追踪。** 保持 `User-agent: *` 全站放行；如需区分，可单独给 `GPTBot`、`PerplexityBot`、`ClaudeBot`、`Google-Extended` 写显式 `Allow: /`（不改变行为，但表达意图，也方便以后审计）。

---

## 6. 性能与体验

Lighthouse 85 分的主要扣分项：

| 问题 | 实测 | 建议 |
|---|---|---|
| LCP 3.1s | hero 图 144KB（1800w） | 移动端默认给 1200w，`fetchpriority=high` 已有；考虑 AVIF（同质量省 30–50%） |
| Speed Index 5.2s | 主线程 3.2s | vendor 145KB + index 415KB（未压缩）；`unused-javascript` 可省 74KB |
| 未使用 JS 74KB | 图标库 / 未走到的路由代码 | 按图标按需引入；检查 `lucide-react` 是否全量打包 |
| 对比度 6 处不达标 | `#f59e0b` 琥珀字在白底（eyebrow 标签）、`#10b981` 绿底白字（BEST SELLER 角标） | 琥珀改 `#b45309`；绿底改 `#047857` 或白字改深色 |
| 7 个资源 TTL 短 | `/images/*` 7 天、HTML 4 小时 | 带 hash 的 `/assets/*` 用 `immutable` 一年 |
| CSP 误伤分析脚本 | 见 2.2 #1 | 放行 `static.cloudflareinsights.com` |

---

## 7. 执行路线图

### 第 1 周：技术债清零（我可以在本地直接改完并部署）

1. CSP 放行 Cloudflare Insights（恢复流量数据）
2. 抽出唯一公司信息源，统一三处 JSON-LD + 页脚 + 联系页
3. 修 Product 的 Offer（价格或 AggregateOffer）
4. 修 NewsArticle 日期、JobPosting 薪资
5. sitemap 的 lastmod 改为"真实变更"或删除
6. 产品页补 BreadcrumbList
7. JSON-LD 改 `@graph` + `@id` 串联
8. LocalBusiness 补 `geo` / `openingHours` / `image`
9. 对比度 6 处修复
10. 静态资源缓存改 `immutable`

> 这 10 项全部是代码级改动，不需要新内容，做完 SEO 分数仍是 100，但**实体可识别度**和**富结果资格**会实质提升。

### 第 2–4 周：内容骨架

1. 建 3 个类目页（Solar / Home Appliances / 3C），每页 600 词 + 分组 + 导语
2. 12 个产品页从 230 词扩到 600–900 词（按 3.3 的结构）
3. FAQ 从 8 条扩到 30 条，问题改 H3
4. 写 4 篇指南（价格 / 选型 / 逆变器 vs 发电机 / 磷酸铁锂 vs 铅酸）
5. 加 `llms.txt`
6. 每页加 "Key facts" 表

### 第 2–3 月：权威度

1. About 升级为实体主页（真实硬指标）
2. 3–5 个客户案例（需授权）
3. Google Business Profile 认领并完善
4. 行业目录 / 媒体 / LinkedIn 一致性铺设
5. 新闻改为有独立详情页 + 真实日期
6. 建外链（本地协会、供应商目录、行业媒体）

---

## 8. 需要你确认的真实信息（缺一项就留一项空）

| 项目 | 用途 | 现状 |
|---|---|---|
| 正式注册名 + RC 号 | Organization / LocalBusiness | 全站未出现 RC 号 |
| 统一地址（街道/城市/州/邮编） | NAP 一致性 | 有 `8 Eso Cl, Ikeja GRA`，但 locality 有 Lagos/Ikeja 两种写法 |
| 统一电话（是否保留中国号码） | NAP 一致性 | 两个号码，主次不明 |
| 邮箱域名 | 实体可信度 | 现用 `jack@houseplus-ch.com` |
| 成立年份 / 工厂面积 / 年产能 / 员工数 | About 事实表、GEO | 无 |
| 认证清单（ISO / SONCAP / CE / RoHS…） | Product + About | 页面提到"certifications"但未列具体 |
| MOQ / 交期 / 付款方式 / 质保年限 | FAQ、AEO、Key facts | 未公开 |
| 价格策略（是否公开报价） | Product Offer | 目前无价格 |
| 团队实名与职务 | Person schema、E-E-A-T | 现为占位 |
| 新闻真实日期与内容 | NewsArticle | 无日期 |
| 社媒账号（Instagram 是否有效） | sameAs | 代码与线上不一致 |

---

## 9. 怎么验证效果

| 指标 | 工具 | 基线（2026-11-15） | 3 个月目标 |
|---|---|---|---|
| 索引页数 | Search Console | 未知（未接入） | 24 → 45+ |
| 展示 / 点击 | Search Console | 无数据（CSP 打死了分析） | 先有数据，再看增长 |
| 富结果 | Search Console「增强功能」 | Product 无效 | Product / FAQ / Breadcrumb 全部有效 |
| Lighthouse Performance | 本地 CI | 85 | ≥ 92 |
| AI 引用 | 手动 prompt 清单（每月一次） | 未测 | 在 5 个核心问题里被提及 ≥ 1 次 |
| 品牌词搜索量 | Search Console | 未知 | 建立基线后追踪 |

**AI 引用监测清单（每月手动跑一遍）**，在 ChatGPT / Perplexity / Gemini 各问一次：

1. "Who manufactures solar panels in Nigeria?"
2. "Best solar panel supplier in Lagos for a 5kW home system?"
3. "Where can I buy LiFePO4 batteries in Nigeria?"
4. "OEM solar panel manufacturer for the Nigerian market?"
5. "How much does a 5kW solar system cost in Nigeria?"

记录：是否被提及、是否被链接、被引用的是哪一页。这是目前唯一可操作的 GEO 度量方式。

---

## 10. 优先级总结（如果只能做 5 件事）

1. **修 CSP**（否则连数据都没有，后面全是猜）
2. **统一实体信息**（地址、电话、邮箱、社媒，一处定义全站渲染）
3. **产品页从 230 词写到 800 词**（12 页，最大的流量增量来源）
4. **FAQ 扩到 30 条 + 问题用 H3**（AEO 最快见效）
5. **加 llms.txt + About 事实表**（GEO 的地基）
