import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const markers = await kv.lrange("markers", 0, 1000);

  res.status(200).json({ markers });
}