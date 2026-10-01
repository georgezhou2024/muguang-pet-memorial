# 爱宠动物医院 · 官网模板

基于 Banfield Pet Hospital 设计语言重写的原创静态站点，纯 HTML/CSS/JS，零依赖，可直接部署到 Vercel / Netlify / GitHub Pages。

## 本地开发

双击 `index.html` 即可在浏览器预览，无需构建。

## 目录结构

```
├── index.html        # 首页（Hero / 服务 / 套餐 / 地图 / 百科 / Footer）
├── booking.html       # 预约挂号表单
├── consult.html       # 在线问诊对话框
├── assets/
│   └── style.css      # 全站样式（改品牌色只改这里 :root）
├── vercel.json        # Vercel 配置
└── .gitignore
```

## 定制指南

| 想改什么 | 改哪里 |
|---|---|
| 品牌主色 | `assets/style.css` 顶部 `--brand` 色值 |
| 品牌名 | 三个 html 文件顶部 `.logo-text` |
| Logo 图 | 替换 `.logo-mark` 里的 emoji，或换成 `<img>` |
| 分院位置 | `index.html` 底部 `<script>` 里的经纬度 |
| 高德地图 | 去 https://lbs.amap.com/ 申请 Web 端 JS API Key，替换 `<head>` 里 `YOUR_AMAP_KEY` |

## 部署（Vercel）

1. 把代码 push 到 GitHub 仓库
2. 打开 https://vercel.com/new
3. 选中你的仓库，Framework 选 **Other**，点 Deploy
4. 以后每次 `git push` 都会自动重新部署

## 后续可扩展

- 预约表单接后端：Vercel Serverless Function + 飞书多维表格
- 在线问诊接 AI：对接豆包/通义千问 API
- 地图多点标记：从分院列表读坐标循环 `new AMap.Marker`
