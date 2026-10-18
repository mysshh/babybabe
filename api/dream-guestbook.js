import { db } from 'hatchable';

export const access = 'public';
export const methods = ['GET', 'POST'];

export default async function (req, res) {
  if (req.method === 'GET') {
    const result = await db.query(
      'SELECT id, nickname, wish, mood, created_at FROM dream_guestbook ORDER BY created_at DESC LIMIT 30'
    );
    return res.json({ wishes: result.rows });
  }

  const body = req.body || {};
  // Honeypot: silently accept bot submissions without saving them.
  if (typeof body.website === 'string' && body.website.trim()) return res.status(201).json({ ok: true });
  const nickname = typeof body.nickname === 'string' ? body.nickname.trim().slice(0, 32) : '';
  const wish = typeof body.wish === 'string' ? body.wish.trim().slice(0, 280) : '';
  const allowedMoods = ['💗', '✨', '🌈', '🌱', '☁️', '🫂'];
  const mood = allowedMoods.includes(body.mood) ? body.mood : '💗';
  if (wish.length < 2) return res.status(400).json({ error: 'Write a tiny wish of at least 2 characters, friend!' });

  const result = await db.query(
    'INSERT INTO dream_guestbook (nickname, wish, mood) VALUES ($1, $2, $3) RETURNING id, nickname, wish, mood, created_at',
    [nickname || 'A little dreamer', wish, mood]
  );
  return res.status(201).json({ wish: result.rows[0] });
}