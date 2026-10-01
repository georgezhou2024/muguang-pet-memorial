// 接收客户预约，追加到 GitHub 仓库 bookings.json
const REPO = process.env.GITHUB_REPO || 'georgezhou2024/muguang-pet-memorial';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({error:'GITHUB_TOKEN 未配置'});

  const booking = req.body;
  booking.time = new Date().toISOString();

  // 1. 读现有 bookings.json
  let bookings = [];
  try {
    const g = await fetch(`https://api.github.com/repos/${REPO}/contents/bookings.json?ref=${BRANCH}`, {
      headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github+json', 'User-Agent': 'muguang-booking' }
    });
    if (g.ok) {
      const j = await g.json();
      bookings = JSON.parse(Buffer.from(j.content, 'base64').toString('utf-8'));
      if (!Array.isArray(bookings)) bookings = [];
      var sha = j.sha;
    }
  } catch(e) {}

  bookings.unshift(booking); // 最新的在前面

  // 2. 写回
  const encoded = Buffer.from(JSON.stringify(bookings, null, 2)).toString('base64');
  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/bookings.json`, {
    method: 'PUT',
    headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github+json', 'User-Agent': 'muguang-booking' },
    body: JSON.stringify({
      message: `booking: 新预约 ${booking.name||''} ${booking.phone||''}`,
      content: encoded,
      branch: BRANCH,
      ...(sha ? { sha } : {})
    })
  });

  if (!r.ok) {
    const t = await r.text();
    return res.status(500).json({error: '保存失败: ' + t});
  }
  return res.status(200).json({ok:true});
}
