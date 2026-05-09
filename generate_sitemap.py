import datetime

# 基础 URL
base_url = "https://www.houseplus.com.ng"

# 静态页面
pages = [
    {"url": "/", "priority": "1.0", "changefreq": "weekly"},
    {"url": "/about", "priority": "0.85", "changefreq": "monthly"},
    {"url": "/products", "priority": "0.95", "changefreq": "weekly"},
    {"url": "/factory", "priority": "0.75", "changefreq": "monthly"},
    {"url": "/services", "priority": "0.80", "changefreq": "monthly"},
    {"url": "/faq", "priority": "0.70", "changefreq": "monthly"},
    {"url": "/contact", "priority": "0.85", "changefreq": "monthly"},
    {"url": "/news", "priority": "0.70", "changefreq": "weekly"},
    {"url": "/careers", "priority": "0.60", "changefreq": "monthly"},
    {"url": "/team", "priority": "0.60", "changefreq": "monthly"},
]

# 产品分类
categories = ["solar", "appliances", "3c"]

# 产品 ID (根据 store.ts 中的内容手动提取或模拟)
product_ids = [
    "solar-panel-mono-400w",
    "solar-inverter-5kw",
    "lithium-battery-100ah",
    "solar-street-light-100w",
    "air-fryer-5l",
    "blender-1200w",
    "smart-watch-pro",
    "tws-earphone",
    "power-bank-20000",
    "sd-card-128gb",
    "charge-controller-40a",
    "rice-cooker-5l"
]

now = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S+00:00")

xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
xml_content += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n'
xml_content += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'

# 添加静态页面
for page in pages:
    xml_content += '  <url>\n'
    xml_content += f'    <loc>{base_url}{page["url"]}</loc>\n'
    xml_content += f'    <lastmod>{now}</lastmod>\n'
    xml_content += f'    <changefreq>{page["changefreq"]}</changefreq>\n'
    xml_content += f'    <priority>{page["priority"]}</priority>\n'
    if page["url"] == "/":
        # 首页多语言支持
        for lang in ["en", "zh", "fr", "ru", "es", "ar"]:
            xml_content += f'    <xhtml:link rel="alternate" hreflang="{lang}" href="{base_url}/{"?lang="+lang if lang != "en" else ""}" />\n'
        xml_content += f'    <xhtml:link rel="alternate" hreflang="x-default" href="{base_url}/" />\n'
        # 首页图片
        xml_content += '    <image:image>\n'
        xml_content += '      <image:loc>https://d2xsxph8kpxj0f.cloudfront.net/310519663457782054/fA3FQLnTsLWN8wdASzWxSY/hero-solar-9WdVUX6sZBGChCdiLZdas5.webp</image:loc>\n'
        xml_content += '      <image:title>HousePlus Group Nigeria Factory - Solar Energy Solutions</image:title>\n'
        xml_content += '    </image:image>\n'
    xml_content += '  </url>\n'

# 添加分类页面
for cat in categories:
    xml_content += '  <url>\n'
    xml_content += f'    <loc>{base_url}/products?cat={cat}</loc>\n'
    xml_content += f'    <lastmod>{now}</lastmod>\n'
    xml_content += '    <changefreq>weekly</changefreq>\n'
    xml_content += '    <priority>0.90</priority>\n'
    xml_content += '  </url>\n'

# 添加产品详情页
for pid in product_ids:
    xml_content += '  <url>\n'
    xml_content += f'    <loc>{base_url}/products/{pid}</loc>\n'
    xml_content += f'    <lastmod>{now}</lastmod>\n'
    xml_content += '    <changefreq>weekly</changefreq>\n'
    xml_content += '    <priority>0.80</priority>\n'
    xml_content += '  </url>\n'

xml_content += '</urlset>'

with open("client/public/sitemap.xml", "w") as f:
    f.write(xml_content)

print("sitemap.xml has been generated successfully.")
