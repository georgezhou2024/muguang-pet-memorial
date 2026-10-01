// 保存预约记录到 GitHub
const REPO = process.env.GITHUB_REPO || 'georgezhou2024/muguang-pet-memorial';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

function cors(res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({error:'no token'});

  const bookings = req.body;
  if (!Array.isArray(bookings)) return res.status(400).json({error:'invalid'});

  // 读取现有文件 sha
  let sha = '';
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/bookings.json?ref=${BRANCH}`, {
      headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github+json', 'User-Agent': 'muguang-bookings' }
    });
    if (r.ok) {
      const j = await r.json();
      sha = j.sha;
    }
  } catch(e) {}

  const content = Buffer.from(JSON.stringify(bookings, null, 2)).toString('base64');
  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/bookings.json`, {
    method: 'PUT',
    headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github+json', 'User-Agent': 'muguang-bookings' },
    body: JSON.stringify({ message: 'update bookings', content, sha, branch: BRANCH })
  });
  if (!r.ok) {
    const t = await r.text();
    return res.status(500).json({error: 'GitHub 写入失败: ' + t});
  }
  return res.status(200).json({ok:true});
}
