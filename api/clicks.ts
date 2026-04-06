import Redis from 'ioredis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL!, { lazyConnect: true });
  }
  return redis;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  // Simple API key auth
  const apiKey = req.query.key as string;
  if (!apiKey || apiKey !== process.env.CLICKS_API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  try {
    const format = (req.query.format as string) || 'csv';
    const days = Math.min(parseInt(req.query.days as string) || 30, 365);
    const typeFilter = req.query.type as string; // 'affiliate', 'external', or omit for all

    const client = getRedis();
    const allClicks: Array<{ ts: string; from: string; to: string; type: string }> = [];

    // Collect clicks for the requested date range
    const now = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = `clicks:${date.toISOString().slice(0, 10)}`;

      const entries = await client.zrange(key, 0, -1);
      for (const entry of entries) {
        try {
          const click = JSON.parse(entry);
          if (!typeFilter || click.type === typeFilter) {
            allClicks.push(click);
          }
        } catch {
          // skip malformed entries
        }
      }
    }

    // Sort by timestamp descending (newest first)
    allClicks.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ total: allClicks.length, clicks: allClicks });
    }

    // CSV format (default) — works with Google Sheets IMPORTDATA
    const csvHeader = 'timestamp,origin_page,destination_url,type';
    const csvRows = allClicks.map((c) => {
      const escapedTo = `"${c.to.replace(/"/g, '""')}"`;
      const escapedFrom = `"${c.from.replace(/"/g, '""')}"`;
      return `${c.ts},${escapedFrom},${escapedTo},${c.type}`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="clicks.csv"');
    return res.status(200).send([csvHeader, ...csvRows].join('\n'));
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
