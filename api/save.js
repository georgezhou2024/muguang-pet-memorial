// Vercel serverless: 把 content.json 提交到 GitHub
// 需要环境变量: GITHUB_TOKEN (fine-grained PAT, 对该 repo 有 contents:write 权限)
// 可选: GITHUB_REPO (默认 georgezhou2024/muguang-pet-memorial), GITHUB_BRANCH (默认 main)

const REPO = process.env.GITHUB_REPO || 'georgezhou2024/muguang-pet-memorial';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({error:'GITHUB_TOKEN 环境变量未配置'});

  const content = req.body;
  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');

  // 1. 查现有文件 sha
  let sha = null;
  try {
    const g = await fetch(`https://api.github.com/repos/${REPO}/contents/content.json?ref=${BRANCH}`, {
      headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github+json', 'User-Agent': 'muguang-admin' }
    });
    if (g.ok) {
      const j = await g.json();
      sha = j.sha;
    }
  } catch (e) {}

  // 2. 提交/更新
  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/content.json`, {
    method: 'PUT',
    headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github+json', 'User-Agent': 'muguang-admin' },
    body: JSON.stringify({
      message: `admin: 更新内容 ${new Date().toISOString()}`,
      content: encoded,
      branch: BRANCH,
      ...(sha ? { sha } : {})
    })
  });

  if (!r.ok) {
    const t = await r.text();
    return res.status(500).json({error: 'GitHub 提交失败: ' + t});
  }
  return res.status(200).json({ok:true, msg:'已提交到 GitHub，Vercel 自动部署中'});
}
