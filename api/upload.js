// Vercel serverless: 上传图片/视频到 GitHub 仓库 images/ 目录
const REPO = process.env.GITHUB_REPO || 'georgezhou2024/muguang-pet-memorial';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({error:'GITHUB_TOKEN 环境变量未配置'});

  const { filename, dataUrl } = req.body;
  if (!filename || !dataUrl) return res.status(400).json({error:'缺少 filename 或 dataUrl'});

  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) return res.status(400).json({error:'dataUrl 格式错误'});
  const mime = m[1];
  const b64 = m[2];

  // 检查大小（base64 约 1.33 倍原文件）
  const sizeMB = (b64.length * 0.75 / 1024 / 1024);
  if (sizeMB > 25) return res.status(400).json({error: `文件太大（${sizeMB.toFixed(1)}MB），GitHub 限制单文件 25MB。视频建议先用压缩工具压缩，或上传到视频平台后粘贴链接。`});

  const ext = mime.split('/')[1] || 'png';
  const safeName = filename.replace(/[^a-zA-Z0-9_\-\.]/g,'_').toLowerCase();
  const path = `images/${Date.now()}_${safeName}`;

  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github+json', 'User-Agent': 'muguang-admin' },
    body: JSON.stringify({ message: `upload: ${path}`, content: b64, branch: BRANCH })
  });

  if (!r.ok) {
    const t = await r.text();
    return res.status(500).json({error: 'GitHub 上传失败: ' + t});
  }
  const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`;
  return res.status(200).json({ok:true, url, path});
}
