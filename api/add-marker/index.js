import { kv } from "@vercel/kv";

export default async function handler(req, res) {
    const { marker } = JSON.parse(req.body)

    try {
        await kv.lpush('markers', marker)
        // await kv.set('setExample', '123abc', { ex: 100, nx: true });
    } catch (error) {
        // Handle errors
        console.log('error', error)
    }

    const markers = await kv.lrange("markers", 0, 1000);

    res.status(200).json({ markers });
}