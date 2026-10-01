// Vercel serverless: 返回当前 content.json
import { readFile } from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  try {
    const p = path.join(process.cwd(), 'content.json');
    const raw = await readFile(p, 'utf-8');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).send(raw);
  } catch (e) {
    res.status(500).json({error: String(e)});
  }
}
