import Redis from 'ioredis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const TTL_SECONDS = 1095 * 24 * 60 * 60; // 3 years

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL!, { lazyConnect: true });
  }
  return redis;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { from, to, type: clientType } = req.body ?? {};

    if (typeof from !== 'string' || typeof to !== 'string') {
      return res.status(400).end();
    }

    if (!from.startsWith('/')) {
      return res.status(400).end();
    }

    const type = clientType === 'affiliate' || to.startsWith('/go/') ? 'affiliate' : 'external';
    const now = Date.now();
    const date = new Date(now).toISOString().slice(0, 10);
    const key = `clicks:${date}`;

    const record = JSON.stringify({
      ts: new Date(now).toISOString(),
      from,
      to,
      type,
    });

    const client = getRedis();
    await client.zadd(key, now, record);
    await client.expire(key, TTL_SECONDS);

    return res.status(204).end();
  } catch {
    return res.status(500).end();
  }
}
