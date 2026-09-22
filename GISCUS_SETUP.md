# Giscus 评论功能配置指南

## v0.1.1 新功能：GitHub 评论集成

### 什么是 Giscus？

Giscus 是一个基于 GitHub Discussions 的轻量级评论系统，支持中文，无需审核。

### 配置步骤

1. **访问 Giscus 配置页面**
   - 打开：https://giscus.app
   - 选择语言为"中文（简体）"

2. **配置仓库信息**
   - 输入仓库：`johhhhnny/marsbrief`
   - 确保仓库是**公开的**
   - 确保已启用 **Discussions** 功能

3. **启用 Discussions**
   - 在仓库 Settings > Features 中勾选 "Discussions"
   - 创建一个讨论分类用于评论（例如"评论"或"Announcements"）

4. **获取配置信息**
   - 在 Giscus 配置页面完成配置后
   - 复制生成的 `data-repo-id` 和 `data-category-id`

5. **更新组件配置**
   - 编辑文件：`src/components/elements/giscus-comments.astro`
   - 替换以下字段：
     - `data-repo-id="YOUR_REPO_ID"`
     - `data-category-id="YOUR_CATEGORY_ID"`

### 配置示例

```astro
<script
  src="https://giscus.app/client.js"
  data-repo="johhhhnny/marsbrief"
  data-repo-id="R_kgDONfW3IQ"          <!-- 你的仓库ID -->
  data-category="Announcements"
  data-category-id="DIC_kwDONfW3Ic4Cm-c3"  <!-- 你的分类ID -->
  ...
</script>
```

### 功能说明

- ✅ 支持 GitHub 账户登录
- ✅ 支持中文显示和评论
- ✅ 支持表情反应
- ✅ 自动映射到 GitHub Discussions
- ✅ 响应式设计，支持深色模式

### 完成后

配置好后，访问任何文章页面，你会在文章底部看到评论区域。用户可以用 GitHub 账户登录后直接评论。
