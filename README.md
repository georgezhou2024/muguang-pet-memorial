# 沐光宠语 · 宠物善终告别服务官网

纯静态 HTML/CSS，零依赖，可直接部署 Vercel / Netlify / GitHub Pages。

## 本地预览

双击 `index.html` 即可。

## 目录

```
├── index.html       # 首页（Hero / 服务 / 流程 / 套餐 / 理念 / 联系）
├── booking.html     # 预约告别表单
├── assets/style.css # 全站样式（改色只改 :root）
├── vercel.json
└── README.md
```

## 定制

| 想改 | 改哪里 |
|---|---|
| 品牌主色 | `assets/style.css` 顶部 `--brand` |
| 品牌名 | 两个 html 文件里 `.logo-text` |
| 电话 | 顶部 `.topbar` 和 `.contact-band .phone` |
| 套餐价格 | `index.html` 里 `.plan .price` |
| 门店地址 / 地图 | 在 `index.html` 加区块，接高德/百度 SDK |

## 部署到 Vercel（自动同步）

1. push 到 GitHub
2. 打开 https://vercel.com/new
3. 选这个仓库，Framework 选 **Other**，点 Deploy
4. 以后每次 `git push` 自动重新部署
