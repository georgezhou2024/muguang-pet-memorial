// Vercel serverless: 校验管理密码
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const { pw } = req.body || {};
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return res.status(500).json({error:'ADMIN_PASSWORD 未配置'});
  if (pw === expected) {
    return res.status(200).json({ok:true});
  }
  return res.status(401).json({error:'wrong password'});
}
