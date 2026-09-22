# Mars Brief 📈

Mars Brief 是一个面向进阶投资者，深度探讨杠杆 ETF、期权策略与市场洞察的中文财经内容空间。

* 🌐 **网站地址**：[https://marsbrief.net/](https://marsbrief.net/)
* 📦 **开源仓库**：[https://github.com/johhhhnny/marsbrief](https://github.com/johhhhnny/marsbrief)

本项目基于 [Astro 5](https://astro.build) 构建，并结合 [Keystatic CMS](https://keystatic.com) 提供强大的可视化内容管理能力，同时支持纯 Markdown/MDX 文件驱动，兼具极致性能与编辑体验。

---

## ✨ 项目特点

- 📝 **双模内容管理**：支持通过 Keystatic 可视化后台管理文章、作者与分类，亦可直接使用 Markdown / MDX 文件。
- 🎨 **现代化响应式设计**：基于 Tailwind CSS v4 & DaisyUI，完美适配桌面、平板与移动设备。
- 🔍 **本地全文搜索**：基于 Pagefind 的静态全文搜索引擎，毫秒级快速响应。
- 💬 **互动评论系统**：集成基于 GitHub Discussions 的 Giscus 评论系统，支持中文与深浅色模式自适应。
- 🌙 **多主题切换**：支持浅色/深色主题自由切换并持久化保存。
- 📱 **完备的内容流**：支持分页浏览、多分类聚合、作者专属归档及相关文章推荐。
- 📡 **订阅与 SEO**：内置 RSS 订阅源生成、Sitemap、Open Graph 社交媒体卡片与 SEO 最佳实践。
- ⚡ **极速构建**：零客户端 JS 运行时负担，秒开静态页面。

---

## 📁 目录结构说明

```text
marsbrief/
├── public/                 # 公共静态资源（favicon、robots.txt、manifest 等）
├── src/
│   ├── assets/             # 图片素材、SVG 图标等
│   ├── components/         # 页面 UI 组件
│   │   ├── bases/          # 基础组件（Head、Icon、主题切换器等）
│   │   ├── cards/          # 卡片组件（文章卡片、头条卡片、作者卡片等）
│   │   ├── elements/       # 业务组件（Giscus 评论、导航栏、分享条等）
│   │   └── shared/         # 共享组件（页脚、分页条、相关推荐等）
│   ├── content/            # 内容数据源 (Astro Content Collections)
│   │   ├── articles/       # 文章内容目录 (MDX)
│   │   ├── authors/        # 作者数据 (MDX)
│   │   ├── categories/     # 分类数据 (JSON)
│   │   └── views/          # 页面自定义视图配置
│   ├── layouts/            # 页面布局模板 (Base / Content / List)
│   ├── lib/                # 业务逻辑、Schema 校验与工具函数
│   │   ├── config/         # 站点全局配置 (站点信息、导航等)
│   │   ├── keystatic/      # Keystatic 字段映射与配置
│   │   ├── schema/         # Zod 内容格式校验规则
│   │   └── utils/          # 工具函数 (阅读时间、日期格式等)
│   ├── pages/              # Astro 路由页面 (文章、分类、归档、搜索等)
│   ├── styles/             # 全局样式 (Tailwind CSS)
│   └── content.config.ts   # Astro 5 内容集合定义
├── astro.config.mjs        # Astro 配置文件
├── dev-server.js           # 自定义开发服务器 (自动提示 CMS 入口)
├── keystatic.config.ts     # Keystatic CMS 配置文件
└── package.json
```

---

## 🚀 快速开始

### 1. 环境要求

- [Node.js](https://nodejs.org/) `>= 18.17.0` 或 [Bun](https://bun.sh/) `>= 1.0.0`
- Git

### 2. 克隆仓库

```bash
git clone https://github.com/johhhhnny/marsbrief.git
cd marsbrief
```

### 3. 安装依赖

推荐使用 Bun 以获得最快的安装体验：

```bash
bun install
# 或使用 npm
npm install
```

### 4. 启动开发服务器

```bash
bun run dev
# 或使用 npm
npm run dev
```

启动后可在浏览器中访问：
* 前台站点：`http://localhost:4321`
* Keystatic CMS 管理后台：`http://localhost:4321/keystatic`

---

## 🛠️ 常用脚本命令

| 命令 | 说明 |
| :--- | :--- |
| `bun run dev` | 启动开发服务器（含 CMS 控制台链接输出） |
| `bun run dev:astro` | 仅启动 Astro 原生开发服务器 |
| `bun run build` | 编译构建生产版本（静态文件输出到 `dist/`） |
| `bun run preview` | 本地预览生产构建产物 |
| `bun run clean` | 清除 `.astro` 缓存与 `dist` 目录 |
| `bun run clean:dev` | 清理缓存并重新启动开发服务 |

---

## ⚙️ 功能配置指南

### 1. 启用 Keystatic CMS 后台

在项目根目录下创建 `.env` 文件：

```env
RUN_KEYSTATIC=true
```

启动开发服务器后，即可在 `http://localhost:4321/keystatic` 直接以可视化界面增删改查文章、分类与作者。

### 2. Giscus 评论系统配置

项目集成基于 GitHub Discussions 的评论组件。具体配置步骤请参见 [GISCUS_SETUP.md](GISCUS_SETUP.md)。

配置简述：
1. 确保 GitHub 仓库为公开状态并在仓库设置中开启 **Discussions** 功能。
2. 访问 [giscus.app](https://giscus.app) 生成您的 `data-repo-id` 和 `data-category-id`。
3. 将 ID 填入 `src/components/elements/giscus-comments.astro` 即可生效。

### 3. 站点基本信息配置

站点的名称、描述、导航栏链接、社交媒体等全局配置均位于：
* `src/lib/config/index.ts`

---

## 💻 技术栈

* **核心框架**：[Astro 5](https://astro.build)
* **内容管理 (CMS)**：[Keystatic](https://keystatic.com)
* **样式与 UI**：[Tailwind CSS v4](https://tailwindcss.com) + [DaisyUI](https://daisyui.com)
* **组件支持**：[React 19](https://react.dev)
* **内容格式**：[MDX](https://mdxjs.com/)
* **静态搜索引擎**：[Pagefind](https://pagefind.app/)
* **评论系统**：[Giscus](https://giscus.app)
* **开发语言**：[TypeScript](https://www.typescriptlang.org/)

---

## 📄 许可证

本项目采用 [MIT License](LICENSE.md) 开源协议。

