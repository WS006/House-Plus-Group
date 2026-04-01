import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'dist/public');

// 所有需要预渲染的路由
const routes = [
  '/',
  '/about',
  '/products',
  '/factory',
  '/team',
  '/services',
  '/faq',
  '/news',
  '/careers',
  '/contact',
  '/privacy',
  '/terms',
];

// 读取 index.html
const indexHtmlPath = path.join(distPath, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

// 为每个路由创建对应的 HTML 文件
routes.forEach(route => {
  if (route === '/') {
    // 主页已经存在
    return;
  }
  
  // 移除前导斜杠
  const routeName = route.substring(1);
  
  // 创建目录
  const routeDir = path.join(distPath, routeName);
  
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  
  // 创建 index.html 文件
  const htmlFilePath = path.join(routeDir, 'index.html');
  fs.writeFileSync(htmlFilePath, indexHtml, 'utf-8');
  console.log(`✓ Created ${routeName}/index.html`);
});

console.log('\n✅ Prerender complete! All routes now have their own index.html files.');
