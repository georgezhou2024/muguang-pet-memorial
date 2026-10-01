// 列出 GitHub images/ 文件夹里所有文件
const REPO = process.env.GITHUB_REPO || 'georgezhou2024/muguang-pet-memorial';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

function cors(res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({error:'no token'});

  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/images?ref=${BRANCH}`, {
    headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github+json', 'User-Agent': 'muguang-media' }
  });
  if (!r.ok) {
    // folder might be empty
    return res.status(200).json({files: []});
  }
  const files = await r.json();
  const list = files.map(f => ({
    name: f.name,
    url: `https://raw.githubusercontent.com/${REPO}/${BRANCH}/images/${f.name}`,
    type: /\.(mp4|webm|mov)$/i.test(f.name) ? 'video' : 'image'
  }));
  return res.status(200).json({files: list});
}
