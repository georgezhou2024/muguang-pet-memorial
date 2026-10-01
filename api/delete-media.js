// 删除 GitHub images/ 文件夹里的文件
const REPO = process.env.GITHUB_REPO || 'georgezhou2024/muguang-pet-memorial';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

function cors(res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','DELETE,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({error:'no token'});

  const { path } = req.body;
  if (!path) return res.status(400).json({error:'缺少 path'});

  // 获取文件 sha
  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
    headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github+json', 'User-Agent': 'muguang-media' }
  });
  if (!r.ok) return res.status(404).json({error:'文件不存在'});
  const j = await r.json();

  // 删除
  const del = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: 'DELETE',
    headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github+json', 'User-Agent': 'muguang-media' },
    body: JSON.stringify({ message: `delete: ${path}`, sha: j.sha, branch: BRANCH })
  });
  if (!del.ok) {
    const t = await del.text();
    return res.status(500).json({error: '删除失败: ' + t});
  }
  return res.status(200).json({ok:true});
}
